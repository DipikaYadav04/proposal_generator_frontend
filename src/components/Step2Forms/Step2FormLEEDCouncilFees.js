import React from 'react';
import TermsAndConditions from '../TermsAndConditions';
import PaymentSchedule from '../PaymentSchedule';
import ProjectOverviewGenerator from '../ProjectOverviewGenerator';
import { Building2, IndianRupee, Calculator } from 'lucide-react';

const LEED_TEMPLATE_LABELS = {
    'leed-hospitality': 'LEED Certification: Hospitality',
    'leed-core-shell': 'LEED Certification: Core & Shell',
    'leed-nc': 'LEED NC Certification',
    'leed-ebom': 'LEED EBOM',
    'leed-net-zero-carbon': 'LEED Net Zero Carbon',
    'leed-zero-water': 'LEED Zero Water Certification',
    'leed-idci': 'LEED v4 ID+CI Certification',
};

// Templates that have {{Design _and_Construction_Cost}} placeholder
const TEMPLATES_WITH_DESIGN_COST = ['leed-hospitality', 'leed-nc', 'leed-idci'];

// Templates that have {{Registration_Cost}} placeholder
const TEMPLATES_WITH_REGISTRATION = ['leed-hospitality', 'leed-nc', 'leed-idci'];

const Step2FormLEEDCouncilFees = ({ formData, handleChange, handlePrevious, handleTermsChange, handlePaymentScheduleChange }) => {
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

    const templateLabel = LEED_TEMPLATE_LABELS[formData.template] || 'LEED Certification';
    const hasDesignCost = TEMPLATES_WITH_DESIGN_COST.includes(formData.template);
    const hasRegistration = TEMPLATES_WITH_REGISTRATION.includes(formData.template);
    const isCoreShell = formData.template === 'leed-core-shell';

    // Calculate total for Core & Shell (feasibility + well certification)
    const feasibilityFee = parseAmount(formData.feasibilityFees);
    const wellCertFee = parseAmount(formData.wellCertificationFees);
    const totalCoreShellFees = feasibilityFee + wellCertFee;

    // Calculate total for standard LEED (registration + design/construction)
    const regFee = parseAmount(formData.registrationCost);
    const designCost = parseAmount(formData.designAndConstructionCost);
    const totalRegistrationFees = regFee + designCost;

    const isLeedNC = formData.template === 'leed-nc';

    // Calculate total of 3 services for LEED NC
    const cost1Amount = parseAmount(formData.cost1);
    const cost2Amount = parseAmount(formData.cost2);
    const cost3Amount = parseAmount(formData.cost3);
    const totalServiceCost = cost1Amount + cost2Amount + cost3Amount;

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

            {/* For LEED NC: 3 separate service costs in a table */}
            {isLeedNC ? (
                <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <Calculator style={{ width: '22px', height: '22px', color: '#2c3e50' }} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', margin: 0 }}>
                            Consultancy Fees
                        </h3>
                    </div>
                    
                    <div style={{
                        border: '2px solid #e0e0e0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: 'white'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 100%)',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.95rem'
                        }}>
                            <div style={{ padding: '14px 16px', textAlign: 'center' }}>S.No.</div>
                            <div style={{ padding: '14px 16px' }}>Service</div>
                            <div style={{ padding: '14px 16px', textAlign: 'right' }}>Cost ({formData.currency || 'INR'})</div>
                        </div>

                        {/* Row 1: LEED BD+C v4 */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            borderBottom: '1px solid #e0e0e0',
                            alignItems: 'center'
                        }}>
                            <div style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '500', color: '#666' }}>1</div>
                            <div style={{ padding: '14px 16px', fontWeight: '500' }}>LEED BD+C v4: Complete Facilitation and Documentation</div>
                            <div style={{ padding: '10px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IndianRupee style={{ width: '16px', height: '16px', color: '#666' }} />
                                    <input
                                        type="text"
                                        id="cost1"
                                        name="cost1"
                                        value={formatCostWithCommas(formData.cost1)}
                                        onChange={handleFeeChange('cost1')}
                                        placeholder="Enter amount"
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            textAlign: 'right',
                                            fontWeight: '600'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Fundamental and Enhanced Commissioning */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            borderBottom: '1px solid #e0e0e0',
                            alignItems: 'center'
                        }}>
                            <div style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '500', color: '#666' }}>2</div>
                            <div style={{ padding: '14px 16px', fontWeight: '500' }}>Fundamental and Enhanced Commissioning</div>
                            <div style={{ padding: '10px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IndianRupee style={{ width: '16px', height: '16px', color: '#666' }} />
                                    <input
                                        type="text"
                                        id="cost2"
                                        name="cost2"
                                        value={formatCostWithCommas(formData.cost2)}
                                        onChange={handleFeeChange('cost2')}
                                        placeholder="Enter amount"
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            textAlign: 'right',
                                            fontWeight: '600'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Envelope Commissioning */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            borderBottom: '1px solid #e0e0e0',
                            alignItems: 'center'
                        }}>
                            <div style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '500', color: '#666' }}>3</div>
                            <div style={{ padding: '14px 16px', fontWeight: '500' }}>Envelope Commissioning</div>
                            <div style={{ padding: '10px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IndianRupee style={{ width: '16px', height: '16px', color: '#666' }} />
                                    <input
                                        type="text"
                                        id="cost3"
                                        name="cost3"
                                        value={formatCostWithCommas(formData.cost3)}
                                        onChange={handleFeeChange('cost3')}
                                        placeholder="Enter amount"
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            textAlign: 'right',
                                            fontWeight: '600'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Total Row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%)',
                            alignItems: 'center'
                        }}>
                            <div style={{ padding: '14px 16px' }}></div>
                            <div style={{ padding: '14px 16px', fontWeight: '700', fontSize: '1.05rem', color: '#2c3e50' }}>
                                Total Consultancy Fees
                            </div>
                            <div style={{ 
                                padding: '14px 16px', 
                                textAlign: 'right', 
                                fontWeight: '700', 
                                fontSize: '1.1rem',
                                color: '#0077B6'
                            }}>
                                {formData.currency || 'INR'} {formatCostWithCommas(totalServiceCost)}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
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
            )}

            {/* Council Fee Structure - for Hospitality, NC, ID+CI (Registration_Cost) */}
            {hasRegistration && (
                <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <Calculator style={{ width: '22px', height: '22px', color: '#2c3e50' }} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', margin: 0 }}>
                            Council Fees
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>(paid directly to USGBC)</span>
                    </div>
                    
                    <div style={{
                        border: '2px solid #e0e0e0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: 'white'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 100%)',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.95rem'
                        }}>
                            <div style={{ padding: '14px 16px', textAlign: 'center' }}>S.No.</div>
                            <div style={{ padding: '14px 16px' }}>Service</div>
                            <div style={{ padding: '14px 16px', textAlign: 'right' }}>Fees ({formData.currency || 'INR'})*</div>
                        </div>

                        {/* Row 1: Registration */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            alignItems: 'center'
                        }}>
                            <div style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '500', color: '#666' }}>1</div>
                            <div style={{ padding: '14px 16px', fontWeight: '500' }}>Registration Fees</div>
                            <div style={{ padding: '10px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IndianRupee style={{ width: '16px', height: '16px', color: '#666' }} />
                                    <input
                                        type="text"
                                        id="registrationCost"
                                        name="registrationCost"
                                        value={formatCostWithCommas(formData.registrationCost)}
                                        onChange={handleFeeChange('registrationCost')}
                                        placeholder="Enter amount"
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            textAlign: 'right',
                                            fontWeight: '600'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Design & Construction Cost (if applicable) */}
                        {hasDesignCost && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '60px 1fr 200px',
                                borderTop: '1px solid #e0e0e0',
                                alignItems: 'center'
                            }}>
                                <div style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '500', color: '#666' }}>2</div>
                                <div style={{ padding: '14px 16px', fontWeight: '500' }}>Design & Construction Cost</div>
                                <div style={{ padding: '10px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <IndianRupee style={{ width: '16px', height: '16px', color: '#666' }} />
                                        <input
                                            type="text"
                                            id="designAndConstructionCost"
                                            name="designAndConstructionCost"
                                            value={formatCostWithCommas(formData.designAndConstructionCost)}
                                            onChange={handleFeeChange('designAndConstructionCost')}
                                            placeholder="Enter amount"
                                            style={{
                                                flex: 1,
                                                padding: '10px 12px',
                                                border: '2px solid #e0e0e0',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                textAlign: 'right',
                                                fontWeight: '600'
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Total Row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%)',
                            alignItems: 'center',
                            borderTop: '1px solid #e0e0e0'
                        }}>
                            <div style={{ padding: '14px 16px' }}></div>
                            <div style={{ padding: '14px 16px', fontWeight: '700', fontSize: '1.05rem', color: '#2c3e50' }}>
                                Total Council Fees
                            </div>
                            <div style={{ 
                                padding: '14px 16px', 
                                textAlign: 'right', 
                                fontWeight: '700', 
                                fontSize: '1.1rem',
                                color: '#0077B6'
                            }}>
                                {formData.currency || 'INR'} {formatCostWithCommas(totalRegistrationFees)}
                            </div>
                        </div>
                    </div>
                    
                    <p style={{ 
                        fontSize: '0.85rem', 
                        color: '#666', 
                        marginTop: '10px', 
                        fontStyle: 'italic' 
                    }}>
                        * Taxes applicable extra as per government norms
                    </p>
                </div>
            )}

            {/* Council Fee Structure - for Core & Shell (feasibility_fees + well_certification_fees) */}
            {isCoreShell && (
                <div className="form-group" style={{ width: '100%', maxWidth: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <Calculator style={{ width: '22px', height: '22px', color: '#2c3e50' }} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', margin: 0 }}>
                            Council Fees
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>(paid directly to USGBC)</span>
                    </div>
                    
                    <div style={{
                        border: '2px solid #e0e0e0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: 'white'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 100%)',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.95rem'
                        }}>
                            <div style={{ padding: '14px 16px', textAlign: 'center' }}>S.No.</div>
                            <div style={{ padding: '14px 16px' }}>Service</div>
                            <div style={{ padding: '14px 16px', textAlign: 'right' }}>Fees ({formData.currency || 'INR'})*</div>
                        </div>

                        {/* Row 1: Feasibility Fees */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            borderBottom: '1px solid #e0e0e0',
                            alignItems: 'center'
                        }}>
                            <div style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '500', color: '#666' }}>1</div>
                            <div style={{ padding: '14px 16px', fontWeight: '500' }}>Feasibility Fees</div>
                            <div style={{ padding: '10px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IndianRupee style={{ width: '16px', height: '16px', color: '#666' }} />
                                    <input
                                        type="text"
                                        id="feasibilityFees"
                                        name="feasibilityFees"
                                        value={formatCostWithCommas(formData.feasibilityFees)}
                                        onChange={handleFeeChange('feasibilityFees')}
                                        placeholder="Enter amount"
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            textAlign: 'right',
                                            fontWeight: '600'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: WELL Certification Fees */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            borderBottom: '1px solid #e0e0e0',
                            alignItems: 'center'
                        }}>
                            <div style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '500', color: '#666' }}>2</div>
                            <div style={{ padding: '14px 16px', fontWeight: '500' }}>WELL Certification Fees</div>
                            <div style={{ padding: '10px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IndianRupee style={{ width: '16px', height: '16px', color: '#666' }} />
                                    <input
                                        type="text"
                                        id="wellCertificationFees"
                                        name="wellCertificationFees"
                                        value={formatCostWithCommas(formData.wellCertificationFees)}
                                        onChange={handleFeeChange('wellCertificationFees')}
                                        placeholder="Enter amount"
                                        style={{
                                            flex: 1,
                                            padding: '10px 12px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            textAlign: 'right',
                                            fontWeight: '600'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Total Row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 200px',
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%)',
                            alignItems: 'center'
                        }}>
                            <div style={{ padding: '14px 16px' }}></div>
                            <div style={{ padding: '14px 16px', fontWeight: '700', fontSize: '1.05rem', color: '#2c3e50' }}>
                                Total Council Fees
                            </div>
                            <div style={{ 
                                padding: '14px 16px', 
                                textAlign: 'right', 
                                fontWeight: '700', 
                                fontSize: '1.1rem',
                                color: '#0077B6'
                            }}>
                                {formData.currency || 'INR'} {formatCostWithCommas(totalCoreShellFees)}
                            </div>
                        </div>
                    </div>
                    
                    <p style={{ 
                        fontSize: '0.85rem', 
                        color: '#666', 
                        marginTop: '10px', 
                        fontStyle: 'italic' 
                    }}>
                        * Taxes applicable extra as per government norms
                    </p>
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
