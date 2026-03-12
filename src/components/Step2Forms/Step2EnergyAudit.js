import React from 'react';
import TermsAndConditions from '../TermsAndConditions';
import PaymentSchedule from '../PaymentSchedule';
import ProjectOverviewGenerator from '../ProjectOverviewGenerator';

const Step2EnergyAudit = ({ formData, handleChange, handlePrevious, handleTermsChange, handlePaymentScheduleChange }) => {
    // Template display names
    const templateNames = {
        'energy-audit': 'Energy Audit (Industry)',
        'water-audit': 'Water Audit',
        'fls-audit': 'FLS Audit',
        'hotel-audit': 'Hotel Energy Audit',
        'mep-proposal': 'MEP Proposal',
        'igbc-new-building': 'IGBC New Building',
        'igbc-existing-building': 'IGBC Existing Building',
        'igbc-green-campus': 'IGBC Green Campus',
        'igbc-green-factory': 'IGBC Green Factory',
        'ecbc-a': 'ECBC Form A',
        'ecbc-bc': 'ECBC Form B&C',
        'ecbc-abc': 'ECBC Form A, B & C'
    };
    const serviceName = templateNames[formData.template] || 'Service';

    // Format cost with Indian comma style (e.g., 100000 → 1,00,000)
    const formatCostWithCommas = (value) => {
        if (!value) return '';
        // Remove existing commas first
        const numericValue = value.toString().replace(/,/g, '');
        
        // Indian numbering system
        const lastThree = numericValue.substring(numericValue.length - 3);
        const otherNumbers = numericValue.substring(0, numericValue.length - 3);
        
        if (otherNumbers !== '') {
            return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
        }
        return lastThree;
    };

    // Handle cost input with comma formatting
    const handleCostChange = (e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, ''); // Keep only numbers
        handleChange({
            target: {
                name: 'cost',
                value: formatCostWithCommas(inputValue) // Store WITH commas
            }
        });
    };

    return (
        <div className="form-step">
            <h2>Step 2: {serviceName} Proposal Details</h2>
            <p className="template-badge" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
                {serviceName}
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
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="cost">Total Cost:</label>
                <input
                    type="text"
                    id="cost"
                    name="cost"
                    value={formatCostWithCommas(formData.cost)}
                    onChange={handleCostChange}
                    placeholder="Enter total cost (e.g., 50,000)"
                    required
                />
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

export default Step2EnergyAudit;
