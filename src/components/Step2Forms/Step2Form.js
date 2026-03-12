import React from 'react';

const Step2Form = ({ formData, handleChange, handlePrevious }) => {
    return (
        <div className="form-step">
            <h2>Step 2: Additional Details</h2>
            
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

            <div className="form-group">
                <label htmlFor="projectDescription">Project Description:</label>
                <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    placeholder="Describe the project in detail..."
                    rows="6"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="termsAndConditions">Terms and Conditions:</label>
                <textarea
                    id="termsAndConditions"
                    name="termsAndConditions"
                    value={formData.termsAndConditions}
                    onChange={handleChange}
                    placeholder="Enter terms and conditions..."
                    rows="6"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="paymentSchedule">Payment Schedule:</label>
                <textarea
                    id="paymentSchedule"
                    name="paymentSchedule"
                    value={formData.paymentSchedule}
                    onChange={handleChange}
                    placeholder="Enter payment schedule details..."
                    rows="6"
                    required
                />
            </div>

            <div className="button-group">
                <button type="button" onClick={handlePrevious} className="btn-previous">
                    Previous
                </button>
                <button type="submit" className="btn-submit">Submit</button>
            </div>
        </div>
    );
};

export default Step2Form;
