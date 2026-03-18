import React from 'react';
import TermsAndConditions from '../TermsAndConditions';
import PaymentSchedule from '../PaymentSchedule';
import ProjectOverviewGenerator from '../ProjectOverviewGenerator';
import FeeTable from '../FeeTable';
import { Building2 } from 'lucide-react';

const LEED_TEMPLATE_LABELS = {
    'leed-hospitality': 'LEED Certification: Hospitality',
    'leed-core-shell': 'LEED Certification: Core & Shell',
    'leed-nc': 'LEED NC Certification',
    'leed-new-construction': 'LEED New Construction',
    'leed-ebom': 'LEED EBOM',
    'leed-net-zero-carbon': 'LEED Net Zero Carbon',
    'leed-zero-water': 'LEED Zero Water Certification',
    'leed-idci': 'LEED v4 ID+CI Certification',
};

// Templates that have a dynamic Professional/Consultancy Fees table
const TEMPLATES_WITH_PROFESSIONAL_FEES = ['leed-nc', 'leed-new-construction'];

// Templates that have a dynamic Council Fees table
const TEMPLATES_WITH_COUNCIL_FEES = ['leed-hospitality', 'leed-nc', 'leed-new-construction', 'leed-idci', 'leed-core-shell'];

// Professional fee service type keys for FeeTable defaults
const PROFESSIONAL_FEE_TYPE = {
    'leed-nc': 'leed-nc-professional',
    'leed-new-construction': 'leed-nc-professional',
};

// Council fee service type keys for FeeTable defaults
const COUNCIL_FEE_TYPE = {
    'leed-nc': 'leed-nc-council',
    'leed-new-construction': 'leed-nc-council',
    'leed-hospitality': 'leed-hospitality-council',
    'leed-idci': 'leed-idci-council',
    'leed-core-shell': 'leed-core-shell-council',
};

const Step2FormLEEDCouncilFees = ({
    formData,
    handleChange,
    handlePrevious,
    handleTermsChange,
    handlePaymentScheduleChange,
    handleProfessionalFeeItemsChange,
    handleCouncilFeeItemsChange,
}) => {
    const formatCostWithCommas = (value) => {
        if (!value) return '';
        const numericValue = value.toString().replace(/,/g, '');
        const lastThree = numericValue.substring(numericValue.length - 3);
        const otherNumbers = numericValue.substring(0, numericValue.length - 3);
        if (otherNumbers !== '') {
            return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
        }
        return lastThree;
    };

    const handleCostChange = (fieldName) => (e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, '');
        handleChange({
            target: { name: fieldName, value: formatCostWithCommas(inputValue) }
        });
    };

    const templateLabel = LEED_TEMPLATE_LABELS[formData.template] || 'LEED Certification';
    const hasProfessionalFees = TEMPLATES_WITH_PROFESSIONAL_FEES.includes(formData.template);
    const hasCouncilFees = TEMPLATES_WITH_COUNCIL_FEES.includes(formData.template);
    const professionalFeeType = PROFESSIONAL_FEE_TYPE[formData.template] || '';
    const councilFeeType = COUNCIL_FEE_TYPE[formData.template] || '';

    return (
        <div className="form-step">
            <h2>Step 2: {templateLabel}</h2>
            <p className="template-badge" style={{ background: 'linear-gradient(135deg, #0077B6 0%, #023E8A 100%)' }}>
                <Building2 style={{ width: '16px', height: '16px', marginRight: '6px', display: 'inline' }} />
                {templateLabel}
            </p>

            <div className="form-group">
                <label htmlFor="currency">Currency:</label>
                <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select currency</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                </select>
            </div>

            {/* Single cost field for non-NC LEED templates */}
            {!hasProfessionalFees && (
                <div className="form-group">
                    <label htmlFor="cost">Consultancy Cost:</label>
                    <input
                        type="text"
                        id="cost"
                        name="cost"
                        value={formatCostWithCommas(formData.cost)}
                        onChange={handleCostChange('cost')}
                        placeholder="Enter consultancy cost (e.g., 50,000)"
                        required
                    />
                </div>
            )}

            {/* Project Name for LEED NC / New Construction (used in professional fees table header) */}
            {['leed-nc', 'leed-new-construction'].includes(formData.template) && (
                <div className="form-group">
                    <label htmlFor="projectName">Project Name:</label>
                    <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName || ''}
                        onChange={handleChange}
                        placeholder="e.g. Cyberpark 1 - Kozhikode, Kerala"
                    />
                </div>
            )}

            {/* Area in sq.ft / Gross Floor Area */}
            {['leed-hospitality', 'leed-core-shell', 'leed-nc', 'leed-new-construction', 'leed-net-zero-carbon', 'leed-idci'].includes(formData.template) && (
                <div className="form-group">
                    <label htmlFor="areaSqFt">
                        {['leed-nc', 'leed-new-construction'].includes(formData.template) ? 'Built Up Area (sq. ft.):' : 'Area (sq.ft):'}
                    </label>
                    <input
                        type="text"
                        id="areaSqFt"
                        name="areaSqFt"
                        value={formData.areaSqFt || ''}
                        onChange={handleChange}
                        placeholder={['leed-nc', 'leed-new-construction'].includes(formData.template) ? 'e.g. 56,496.72' : 'Enter area in sq.ft'}
                    />
                </div>
            )}

            {/* Dynamic Professional / Consultancy Fees Table (LEED NC) */}
            {hasProfessionalFees && (
                <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                    <FeeTable
                        feeItems={formData.professionalFeeItems}
                        setFeeItems={handleProfessionalFeeItemsChange}
                        serviceType={professionalFeeType}
                        tableLabel="Consultancy Fees"
                        col2Label="Service"
                        col3Label="Fees"
                        currency={formData.currency || 'INR'}
                        footnote=""
                    />
                </div>
            )}

            {/* Dynamic Council Fees Table */}
            {hasCouncilFees && (
                <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                    <FeeTable
                        feeItems={formData.councilFeeItems}
                        setFeeItems={handleCouncilFeeItemsChange}
                        serviceType={councilFeeType}
                        tableLabel="Council Fees"
                        col2Label="Service"
                        col3Label="Fees"
                        currency={formData.currency || 'INR'}
                        footnote="* Taxes applicable extra as per government norms"
                    />
                </div>
            )}

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <ProjectOverviewGenerator
                    formData={formData}
                    handleChange={handleChange}
                    serviceType={formData.template}
                />
            </div>

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <TermsAndConditions
                    selectedTerms={formData.termsAndConditions}
                    onTermsChange={handleTermsChange}
                    serviceType={formData.template}
                />
            </div>

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <PaymentSchedule
                    paymentItems={formData.paymentSchedule}
                    setPaymentItems={handlePaymentScheduleChange}
                    serviceType={formData.template}
                />
            </div>

            <div className="button-group">
                <button type="button" onClick={handlePrevious} className="btn-previous">
                    Previous
                </button>
                <button type="submit" className="btn-submit">Next</button>
            </div>
        </div>
    );
};

export default Step2FormLEEDCouncilFees;
