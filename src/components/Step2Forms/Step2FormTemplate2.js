import React from 'react';

const Step2FormTemplate2 = ({ formData, handleChange, handlePrevious }) => {
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
            <h2>Step 2: Quick Proposal Details</h2>
            <p className="template-badge template-2">Template 2 - Simple</p>
            
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
                    type="text"
                    id="cost"
                    name="cost"
                    value={formatCostWithCommas(formData.cost)}
                    onChange={handleCostChange}
                    placeholder="Enter cost amount (e.g., 50,000)"
                    required
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

export default Step2FormTemplate2;
