import React from 'react';
import TermsAndConditions from '../TermsAndConditions';
import PaymentSchedule from '../PaymentSchedule';
import ProjectOverviewGenerator from '../ProjectOverviewGenerator';
import { Building2, IndianRupee, Calculator } from 'lucide-react';

const Step2FormIGBCNetZero = ({ formData, handleChange, handlePrevious, handleTermsChange, handlePaymentScheduleEnergyChange, handlePaymentScheduleWaterChange, handlePaymentScheduleWasteChange }) => {
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

    const handleFeeChange = (fieldName) => (e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, '');
        handleChange({
            target: {
                name: fieldName,
                value: formatCostWithCommas(inputValue)
            }
        });
    };

    const parseAmount = (value) => {
        if (!value) return 0;
        return parseInt(value.toString().replace(/,/g, ''), 10) || 0;
    };

    const feeTableStyle = {
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'white',
        marginBottom: '8px'
    };

    const headerStyle = {
        display: 'grid',
        gridTemplateColumns: '60px 1fr 200px',
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.95rem'
    };

    const rowStyle = {
        display: 'grid',
        gridTemplateColumns: '60px 1fr 200px',
        borderBottom: '1px solid #e0e0e0',
        alignItems: 'center'
    };

    const inputStyle = {
        flex: 1,
        padding: '10px 12px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        textAlign: 'right',
        fontWeight: '600'
    };

    const renderFeeTable = (label, regField, certField) => {
        const regFee = parseAmount(formData[regField]);
        const certFee = parseAmount(formData[certField]);
        const total = regFee + certFee;

        return (
            <div style={{ marginBottom: '20px' }}>
                <div style={feeTableStyle}>
                    <div style={headerStyle}>
                        <div style={{ padding: '14px 16px', textAlign: 'center' }}>S.No.</div>
                        <div style={{ padding: '14px 16px' }}>Service for {label}</div>
                        <div style={{ padding: '14px 16px', textAlign: 'right' }}>Fees ({formData.currency || 'INR'})*</div>
                    </div>

                    <div style={rowStyle}>
                        <div style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '500', color: '#666' }}>1</div>
                        <div style={{ padding: '14px 16px', fontWeight: '500' }}>Registration</div>
                        <div style={{ padding: '10px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <IndianRupee style={{ width: '16px', height: '16px', color: '#666' }} />
                                <input
                                    type="text"
                                    value={formatCostWithCommas(formData[regField])}
                                    onChange={handleFeeChange(regField)}
                                    placeholder="Enter amount"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div style={rowStyle}>
                        <div style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '500', color: '#666' }}>2</div>
                        <div style={{ padding: '14px 16px', fontWeight: '500' }}>Certification</div>
                        <div style={{ padding: '10px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <IndianRupee style={{ width: '16px', height: '16px', color: '#666' }} />
                                <input
                                    type="text"
                                    value={formatCostWithCommas(formData[certField])}
                                    onChange={handleFeeChange(certField)}
                                    placeholder="Enter amount"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr 200px',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%)',
                        alignItems: 'center'
                    }}>
                        <div style={{ padding: '14px 16px' }}></div>
                        <div style={{ padding: '14px 16px', fontWeight: '700', fontSize: '1.05rem', color: '#2c3e50' }}>
                            Total
                        </div>
                        <div style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem', color: '#1ABC9C' }}>
                            {formData.currency || 'INR'} {formatCostWithCommas(total)}
                        </div>
                    </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic', margin: '4px 0 0 0' }}>*GST Extra</p>
            </div>
        );
    };

    return (
        <div className="form-step">
            <h2>Step 2: IGBC Net Zero Certification</h2>
            <p className="template-badge" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #1ABC9C 100%)' }}>
                <Building2 style={{ width: '16px', height: '16px', marginRight: '6px', display: 'inline' }} />
                IGBC Net Zero Certification
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
                <label htmlFor="cost">Consultancy Cost:</label>
                <input
                    type="text"
                    id="cost"
                    name="cost"
                    value={formatCostWithCommas(formData.cost)}
                    onChange={handleFeeChange('cost')}
                    placeholder="Enter consultancy cost (e.g., 50,000)"
                    required
                />
            </div>

            {/* Council Fees - 3 separate tables for Energy, Water, Waste */}
            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <Calculator style={{ width: '22px', height: '22px', color: '#2c3e50' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', margin: 0 }}>
                        Council Fees
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>(paid directly to IGBC)</span>
                </div>

                {renderFeeTable('IGBC NET Zero Energy', 'registrationFeesE', 'certificationFeesE')}
                {renderFeeTable('IGBC NET Zero Water', 'registrationFeesW', 'certificationFeesW')}
                {renderFeeTable('IGBC NET Zero Waste', 'registrationFeesWa', 'certificationFeesWa')}
            </div>

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <ProjectOverviewGenerator
                    formData={formData}
                    handleChange={handleChange}
                    serviceType="igbc-net-zero"
                />
            </div>

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <TermsAndConditions 
                    selectedTerms={formData.termsAndConditions}
                    onTermsChange={handleTermsChange}
                    serviceType="igbc-net-zero"
                />
            </div>

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                    Payment Stages — Energy
                </h3>
                <PaymentSchedule 
                    paymentItems={formData.paymentScheduleEnergy}
                    setPaymentItems={handlePaymentScheduleEnergyChange}
                    serviceType="igbc-net-zero-energy"
                />
            </div>

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                    Payment Stages — Water
                </h3>
                <PaymentSchedule 
                    paymentItems={formData.paymentScheduleWater}
                    setPaymentItems={handlePaymentScheduleWaterChange}
                    serviceType="igbc-net-zero-water"
                />
            </div>

            <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                    Payment Stages — Waste
                </h3>
                <PaymentSchedule 
                    paymentItems={formData.paymentScheduleWaste}
                    setPaymentItems={handlePaymentScheduleWasteChange}
                    serviceType="igbc-net-zero-waste"
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

export default Step2FormIGBCNetZero;
