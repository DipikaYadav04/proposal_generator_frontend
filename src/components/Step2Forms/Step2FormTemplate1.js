import React from 'react';
import TermsAndConditions from '../TermsAndConditions';
import PaymentSchedule from '../PaymentSchedule';
import ProjectOverviewGenerator from '../ProjectOverviewGenerator';

const Step2FormTemplate1 = ({ formData, handleChange, handlePrevious, handleTermsChange, handlePaymentScheduleChange }) => {
    return (
        <div className="form-step">
            <h2>Step 2: Complete Proposal Details</h2>
            <p className="template-badge">Template 1 - Detailed</p>
            
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
                <label htmlFor="cost">Cost:</label>
                <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="Enter cost amount"
                    min="0"
                    step="0.01"
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
                />
            </div>

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <PaymentSchedule 
                    paymentItems={formData.paymentSchedule}
                    setPaymentItems={handlePaymentScheduleChange}
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

export default Step2FormTemplate1;
