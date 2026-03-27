import React from 'react';
import TermsAndConditions from '../TermsAndConditions';
import PaymentSchedule from '../PaymentSchedule';
import ProjectOverviewGenerator from '../ProjectOverviewGenerator';
import { Building2 } from 'lucide-react';

const Step2FormIGBCNewPreFinal = ({ formData, handleChange, handlePrevious, handleTermsChange, handlePaymentScheduleChange }) => {
    // Format cost with Indian comma style (e.g., 100000 → 1,00,000)
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
            target: {
                name: fieldName,
                value: formatCostWithCommas(inputValue)
            }
        });
    };

    return (
        <div className="form-step">
            <h2>Step 2: IGBC New Building Pre + Final Certification</h2>
            <p className="template-badge" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
                <Building2 style={{ width: '16px', height: '16px', marginRight: '6px', display: 'inline' }} />
                IGBC New Building Pre + Final
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

            <div className="form-group">
                <label htmlFor="finalCertification">IGBC Green New Building Final Certification (Fees):</label>
                <input
                    type="text"
                    id="finalCertification"
                    name="finalCertification"
                    value={formatCostWithCommas(formData.finalCertification)}
                    onChange={handleCostChange('finalCertification')}
                    placeholder="e.g., 5,00,000"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="preFinalCertification">Pre + Final Certification (Fees):</label>
                <input
                    type="text"
                    id="preFinalCertification"
                    name="preFinalCertification"
                    value={formatCostWithCommas(formData.preFinalCertification)}
                    onChange={handleCostChange('preFinalCertification')}
                    placeholder="e.g., 6,50,000"
                    required
                />
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                    * GST extra as per government norms
                </p>
            </div>

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
                    serviceType="igbc-new-building-pre-final"
                />
            </div>

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <PaymentSchedule
                    paymentItems={formData.paymentSchedule}
                    setPaymentItems={handlePaymentScheduleChange}
                    serviceType="igbc-new-building-pre-final"
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

export default Step2FormIGBCNewPreFinal;
