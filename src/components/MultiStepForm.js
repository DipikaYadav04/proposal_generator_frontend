import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Step1Form from './Step1Form';
import { 
    Step2EnergyAudit, 
    Step2FormIGBCExisting, 
    Step2FormIGBCNew, 
    Step2FormIGBCNewPreFinal,
    Step2FormIGBCGreenFactory,
    Step2FormIGBCGreenServices,
    Step2FormIGBCGreenInteriors,
    Step2FormIGBCNetZero,
    Step2FormLEEDCouncilFees,
    Step2FormLEEDCommissioning,
    Step2FormLEEDLCA,
    Step2FormTemplate2 
} from './Step2Forms';
import Step3Preview from './Step3Preview';
import { generateProposal, downloadProposal, validateFormData } from '../services/proposalService';

const MultiStepForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedFilename, setGeneratedFilename] = useState(null);
    const [formData, setFormData] = useState({
        serviceCategory: '',
        serviceSubCategory: '',
        template: '',
        clientName: '',
        submittedTo: '',
        date: '',
        currency: '',
        cost: '',
        area: '',
        registrationCost: '',
        certificationCost: '',
        registrationFeesE: '',
        certificationFeesE: '',
        registrationFeesW: '',
        certificationFeesW: '',
        registrationFeesWa: '',
        certificationFeesWa: '',
        projectName: '',
        cityName: '',
        areaSqFt: '',
        fundamentalCxFees: '',
        enhancedCxFees: '',
        projectDescription: '',
        termsAndConditions: [],
        paymentSchedule: [],
        paymentScheduleEnergy: [],
        paymentScheduleWater: [],
        paymentScheduleWaste: [],
        professionalFeeItems: [],
        councilFeeItems: [],
        finalCertification: '',
        preFinalCertification: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCategoryChange = (e) => {
        setFormData({
            ...formData,
            serviceCategory: e.target.value,
            serviceSubCategory: '',
            template: ''
        });
    };

    const handleSubCategoryChange = (e) => {
        setFormData({
            ...formData,
            serviceSubCategory: e.target.value,
            template: ''
        });
    };

    const handleTermsChange = (updatedTerms) => {
        setFormData({
            ...formData,
            termsAndConditions: updatedTerms
        });
    };

    const handlePaymentScheduleChange = (updatedSchedule) => {
        setFormData({
            ...formData,
            paymentSchedule: updatedSchedule
        });
    };

    const handlePaymentScheduleEnergyChange = (updatedSchedule) => {
        setFormData(prev => ({ ...prev, paymentScheduleEnergy: updatedSchedule }));
    };

    const handlePaymentScheduleWaterChange = (updatedSchedule) => {
        setFormData(prev => ({ ...prev, paymentScheduleWater: updatedSchedule }));
    };

    const handlePaymentScheduleWasteChange = (updatedSchedule) => {
        setFormData(prev => ({ ...prev, paymentScheduleWaste: updatedSchedule }));
    };

    const handleProfessionalFeeItemsChange = (updatedItems) => {
        setFormData(prev => ({ ...prev, professionalFeeItems: updatedItems }));
    };

    const handleCouncilFeeItemsChange = (updatedItems) => {
        setFormData(prev => ({ ...prev, councilFeeItems: updatedItems }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Reset form and go back to Step 1 for new proposal
    const handleStartNew = () => {
        if (window.confirm('Are you sure you want to start a new proposal? All current data will be lost.')) {
            setCurrentStep(1);
            setGeneratedFilename(null);
            setIsSubmitting(false);
            setFormData({
                serviceCategory: '',
                serviceSubCategory: '',
                template: '',
                clientName: '',
                submittedTo: '',
                date: '',
                currency: '',
                cost: '',
                area: '',
                registrationCost: '',
                certificationCost: '',
                registrationFeesE: '',
                certificationFeesE: '',
                registrationFeesW: '',
                certificationFeesW: '',
                registrationFeesWa: '',
                certificationFeesWa: '',
                projectName: '',
                cityName: '',
                areaSqFt: '',
                projectDescription: '',
                termsAndConditions: [],
                paymentSchedule: [],
                paymentScheduleEnergy: [],
                paymentScheduleWater: [],
                paymentScheduleWaste: [],
                professionalFeeItems: [],
                councilFeeItems: [],
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form data
        const validation = validateFormData(formData);
        if (!validation.isValid) {
            alert('Please fix the following errors:\n\n' + validation.errors.join('\n'));
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('📋 Submitting form data:', formData);
            
            // Generate proposal
            const result = await generateProposal(formData);

            if (result.success) {
                console.log('📋 Full backend response:', result);
                console.log('📋 Backend response data:', result.data);
                console.log('📋 Available keys in result.data:', Object.keys(result.data || {}));
                
                // Backend returns filename in response.data.filename
                // Pattern: Energy Audit (Industry)_{ClientName}_{Date}_{Time}.docx
                // Example: Energy Audit (Industry)_ABC_Manufacturing_Ltd_20250926_151412.docx
                let filename = null;
                
                if (result.data?.filename) {
                    filename = result.data.filename;
                    console.log('✅ Found backend-generated filename:', filename);
                    console.log('📋 Filename pattern: Energy Audit (Industry)_{ClientName}_{YYYYMMDD}_{HHMMSS}.docx');
                } else {
                    // Fallback: create expected filename pattern if backend doesn't return it
                    const sanitizedClientName = (formData.clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
                    const formattedDate = (formData.date || '2025-10-07').replace(/-/g, '');
                    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '_');
                    filename = `Energy Audit (Industry)_${sanitizedClientName}_${formattedDate}_${timestamp}.docx`;
                    console.log('⚠️ Backend filename not found, using fallback pattern:', filename);
                }
                
                const message = result.data?.message || 'Proposal generated successfully!';
                const status = result.data?.status || 'success';
                
                setGeneratedFilename(filename);
                console.log('✅ Final filename set to state:', filename);
                console.log('📊 Backend status:', status);
                
                alert(`✅ Success!\n\n${message}\n\nFile: ${filename}\n\nClick "Download Proposal" to get your document.`);
                console.log('✅ Proposal generated:', result.data);
            } else {
                alert(`❌ Error:\n\n${result.error}`);
                console.error('❌ Error:', result.error);
            }
        } catch (error) {
            console.error('❌ Unexpected error:', error);
            alert(`❌ Unexpected Error:\n\n${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = async () => {
        if (!generatedFilename) {
            alert('No proposal has been generated yet. Please submit the form first.');
            return;
        }

        try {
            console.log('📥 Starting download:', generatedFilename);
            
            const result = await downloadProposal(generatedFilename);

            if (result.success) {
                console.log('📄 Downloaded file size:', result.data.size, 'bytes');
                console.log('📄 Content type:', result.contentType);
                console.log('📄 Downloading file:', result.filename);
                
                // Determine content type based on file extension
                let contentType = result.contentType;
                if (!contentType) {
                    if (result.filename.endsWith('.docx')) {
                        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    } else if (result.filename.endsWith('.pdf')) {
                        contentType = 'application/pdf';
                    } else {
                        contentType = 'application/octet-stream';
                    }
                    console.log('📄 Using inferred content type:', contentType);
                }
                
                // Create blob with proper content type
                const blob = new Blob([result.data], { type: contentType });
                
                // Create download link with backend-generated filename
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', result.filename); // Uses backend filename like "Energy_Audit_Proposal_ACME_Corporation_20251015.docx"
                
                // Append to body, click, and cleanup
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);

                console.log('✅ Download completed for file:', result.filename);
                alert('✅ Proposal downloaded successfully!');
            } else {
                alert(`❌ Download Error:\n\n${result.error}`);
                console.error('❌ Download error:', result.error);
            }
        } catch (error) {
            console.error('❌ Download error:', error);
            alert(`❌ Download Error:\n\n${error.message}`);
        }
    };

    const getProgressWidth = () => {
        if (currentStep === 1) return '0%';
        if (currentStep === 2) return '33.33%';
        if (currentStep === 3) return '66.66%';
        return '0%';
    };

    return (
        <>
        {/* New Proposal Button - fixed to viewport top-left, outside form container so CSS transforms don't affect it */}
        <button
            type="button"
            onClick={handleStartNew}
            style={{
                position: 'fixed',
                left: '20px',
                top: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                backgroundColor: '#ffffff',
                color: '#4A90E2',
                border: '2px solid #4A90E2',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1000,
                fontWeight: '600',
                fontSize: '0.9rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}
            onMouseOver={(e) => {
                // #region agent log
                fetch('http://127.0.0.1:7751/ingest/48f8d37b-2c76-4504-b979-4f93be11cf0a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cda81d'},body:JSON.stringify({sessionId:'cda81d',runId:'post-fix',hypothesisId:'H1',location:'MultiStepForm.js:onMouseOver',message:'Button hover - checking position is viewport-relative',data:{rect:e.currentTarget.getBoundingClientRect(),parentClass:e.currentTarget.parentElement?.className},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
                e.currentTarget.style.backgroundColor = '#4A90E2';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
            }}
            onMouseOut={(e) => {
                // #region agent log
                fetch('http://127.0.0.1:7751/ingest/48f8d37b-2c76-4504-b979-4f93be11cf0a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cda81d'},body:JSON.stringify({sessionId:'cda81d',runId:'post-fix',hypothesisId:'H1',location:'MultiStepForm.js:onMouseOut',message:'Button mouseOut - verifying no shake loop',data:{rect:e.currentTarget.getBoundingClientRect(),parentClass:e.currentTarget.parentElement?.className},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#4A90E2';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            }}
            title="Start a new proposal"
        >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            New Proposal
        </button>

        <div className="multi-step-form-container">
            {/* Company Logo */}
            <div className="company-logo-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img 
                    src="/logo.png" 
                    alt="Company Logo" 
                    className="company-logo"
                />
            </div>

            <div className="progress-indicator" style={{ '--progress': getProgressWidth() }}>
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Basic Info</span>
                </div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Details</span>
                </div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Review</span>
                </div>
            </div>

            <form onSubmit={currentStep === 3 ? handleSubmit : handleNext}>
                {currentStep === 1 && (
                    <Step1Form 
                        formData={formData}
                        handleChange={handleChange}
                        handleCategoryChange={handleCategoryChange}
                        handleSubCategoryChange={handleSubCategoryChange}
                        handleNext={handleNext}
                    />
                )}

                {currentStep === 2 && formData.template === 'igbc-existing-building' && (
                    <Step2FormIGBCExisting 
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleChange={handlePaymentScheduleChange}
                    />
                )}

                {currentStep === 2 && formData.template === 'igbc-new-building-pre-final' && (
                    <Step2FormIGBCNewPreFinal
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleChange={handlePaymentScheduleChange}
                    />
                )}

                {currentStep === 2 && [
                    'igbc-green-campus',
                    'igbc-new-building',
                    'igbc-green-healthcare',
                    'igbc-green-homes',
                    'igbc-green-school',
                    'igbc-green-health-wellbeing',
                    'igbc-green-hotel',
                ].includes(formData.template) && (
                    <Step2FormIGBCNew 
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleChange={handlePaymentScheduleChange}
                    />
                )}

                {currentStep === 2 && [
                    'leed-hospitality',
                    'leed-core-shell',
                    'leed-nc',
                    'leed-new-construction',
                    'leed-ebom',
                    'leed-net-zero-carbon',
                    'leed-zero-water',
                    'leed-idci',
                ].includes(formData.template) && (
                    <Step2FormLEEDCouncilFees
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleChange={handlePaymentScheduleChange}
                        handleProfessionalFeeItemsChange={handleProfessionalFeeItemsChange}
                        handleCouncilFeeItemsChange={handleCouncilFeeItemsChange}
                    />
                )}

                {currentStep === 2 && formData.template === 'leed-commissioning' && (
                    <Step2FormLEEDCommissioning
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleChange={handlePaymentScheduleChange}
                    />
                )}

                {currentStep === 2 && formData.template === 'leed-lca' && (
                    <Step2FormLEEDLCA
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleChange={handlePaymentScheduleChange}
                    />
                )}

                {currentStep === 2 && formData.template === 'igbc-green-services-building' && (
                    <Step2FormIGBCGreenServices 
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleChange={handlePaymentScheduleChange}
                    />
                )}

                {currentStep === 2 && formData.template === 'igbc-green-interiors' && (
                    <Step2FormIGBCGreenInteriors 
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleChange={handlePaymentScheduleChange}
                    />
                )}

                {currentStep === 2 && formData.template === 'igbc-net-zero' && (
                    <Step2FormIGBCNetZero 
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleEnergyChange={handlePaymentScheduleEnergyChange}
                        handlePaymentScheduleWaterChange={handlePaymentScheduleWaterChange}
                        handlePaymentScheduleWasteChange={handlePaymentScheduleWasteChange}
                    />
                )}

                {currentStep === 2 && formData.template === 'igbc-green-factory' && (
                    <Step2FormIGBCGreenFactory 
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleChange={handlePaymentScheduleChange}
                    />
                )}

                {currentStep === 2 && formData.template !== 'template2' && formData.template !== 'igbc-existing-building' && formData.template !== 'igbc-green-services-building' && formData.template !== 'igbc-green-interiors' && !['igbc-green-campus','igbc-new-building','igbc-new-building-pre-final','igbc-green-healthcare','igbc-green-homes','igbc-green-school','igbc-green-health-wellbeing','igbc-green-hotel','igbc-net-zero','igbc-green-factory','leed-hospitality','leed-core-shell','leed-nc','leed-new-construction','leed-commissioning','leed-lca','leed-ebom','leed-net-zero-carbon','leed-zero-water','leed-idci'].includes(formData.template) && formData.template !== '' && (
                    <Step2EnergyAudit 
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                        handleTermsChange={handleTermsChange}
                        handlePaymentScheduleChange={handlePaymentScheduleChange}
                    />
                )}

                {currentStep === 2 && formData.template === 'template2' && (
                    <Step2FormTemplate2 
                        formData={formData}
                        handleChange={handleChange}
                        handlePrevious={handlePrevious}
                    />
                )}

                {currentStep === 3 && (
                    <Step3Preview 
                        formData={formData}
                        handlePrevious={handlePrevious}
                        isSubmitting={isSubmitting}
                        generatedFilename={generatedFilename}
                        handleDownload={handleDownload}
                    />
                )}
            </form>
        </div>
        </>
    );
};

export default MultiStepForm;