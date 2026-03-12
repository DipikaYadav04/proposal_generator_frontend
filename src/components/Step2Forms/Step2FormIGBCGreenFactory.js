import React from 'react';
import TermsAndConditions from '../TermsAndConditions';
import PaymentSchedule from '../PaymentSchedule';
import ProjectOverviewGenerator from '../ProjectOverviewGenerator';
import { Factory } from 'lucide-react';

const Step2FormIGBCGreenFactory = ({ formData, handleChange, handlePrevious, handleTermsChange, handlePaymentScheduleChange }) => {
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

    // Format area with commas for display
    const formatAreaWithCommas = (value) => {
        if (!value) return '';
        const numericValue = value.toString().replace(/,/g, '');
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Handle area input
    const handleAreaChange = (e) => {
        const inputValue = e.target.value.replace(/[^0-9.]/g, ''); // Keep only numbers and decimal
        handleChange({
            target: {
                name: 'area',
                value: inputValue
            }
        });
    };

    return (
        <div className="form-step">
            <h2>Step 2: IGBC Green Factory Certification</h2>
            <p className="template-badge" style={{ background: 'linear-gradient(135deg, #8E44AD 0%, #9B59B6 100%)' }}>
                <Factory style={{ width: '16px', height: '16px', marginRight: '6px', display: 'inline' }} />
                IGBC Green Factory
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
                <label htmlFor="area">Area (Sqm):</label>
                <input
                    type="text"
                    id="area"
                    name="area"
                    value={formatAreaWithCommas(formData.area)}
                    onChange={handleAreaChange}
                    placeholder="Enter area in square meters (e.g., 10,000)"
                    required
                />
                <p style={{ 
                    fontSize: '0.85rem', 
                    color: '#666', 
                    marginTop: '8px', 
                    fontStyle: 'italic' 
                }}>
                    * Enter the total factory area in Square Meters (Sqm)
                </p>
            </div>

            <div className="form-group">
                <label htmlFor="cost">Consultancy Cost:</label>
                <input
                    type="text"
                    id="cost"
                    name="cost"
                    value={formatCostWithCommas(formData.cost)}
                    onChange={handleCostChange}
                    placeholder="Enter consultancy cost (e.g., 5,00,000)"
                    required
                />
                <p style={{ 
                    fontSize: '0.85rem', 
                    color: '#666', 
                    marginTop: '8px', 
                    fontStyle: 'italic' 
                }}>
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
                    serviceType="igbc-green-factory"
                />
            </div>

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <PaymentSchedule 
                    paymentItems={formData.paymentSchedule}
                    setPaymentItems={handlePaymentScheduleChange}
                    serviceType="igbc-green-factory"
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

export default Step2FormIGBCGreenFactory;
