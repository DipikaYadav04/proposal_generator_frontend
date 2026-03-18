import React from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';

const FeeTable = ({
    feeItems = [],
    setFeeItems,
    serviceType = '',
    tableLabel = 'Fee Table',
    col2Label = 'Service',
    col3Label = 'Amount',
    currency = 'INR',
    footnote = '* Taxes applicable extra as per government norms',
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

    const parseAmount = (value) => {
        if (!value) return 0;
        return parseInt(value.toString().replace(/,/g, ''), 10) || 0;
    };

    const totalAmount = feeItems.reduce((sum, item) => sum + parseAmount(item.amount), 0);

    // Default items per service type
    const getDefaultItems = (type) => {
        switch (type) {
            case 'leed-nc-professional':
                return [
                    { service: 'LEED BD+C v4: Complete Facilitation and Documentation', amount: '' },
                    { service: 'Fundamental and Enhanced Commissioning', amount: '' },
                    { service: 'Envelope Commissioning', amount: '' },
                ];
            case 'leed-nc-council':
                return [
                    { service: 'Registration Fees', amount: '' },
                    { service: 'Design & Construction Cost', amount: '' },
                ];
            case 'leed-hospitality-council':
            case 'leed-idci-council':
                return [
                    { service: 'Registration Fees', amount: '' },
                    { service: 'Design & Construction Cost', amount: '' },
                ];
            case 'leed-core-shell-council':
                return [
                    { service: 'Feasibility Fees', amount: '' },
                    { service: 'WELL Certification Fees', amount: '' },
                ];
            default:
                return [{ service: '', amount: '' }];
        }
    };

    const handleLoadDefaults = () => {
        setFeeItems(getDefaultItems(serviceType));
    };

    const addRow = () => {
        setFeeItems([...feeItems, { service: '', amount: '' }]);
    };

    const removeRow = (index) => {
        if (feeItems.length > 1) {
            setFeeItems(feeItems.filter((_, i) => i !== index));
        }
    };

    const updateRow = (index, field, value) => {
        const updated = feeItems.map((item, i) => {
            if (i === index) {
                if (field === 'amount') {
                    const numeric = value.replace(/[^0-9]/g, '');
                    return { ...item, amount: formatCostWithCommas(numeric) };
                }
                return { ...item, [field]: value };
            }
            return item;
        });
        setFeeItems(updated);
    };

    // Load defaults if empty on first render
    React.useEffect(() => {
        if (feeItems.length === 0 && serviceType) {
            setFeeItems(getDefaultItems(serviceType));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceType]);

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calculator style={{ width: '22px', height: '22px', color: '#2c3e50' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', margin: 0 }}>
                        {tableLabel}
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={handleLoadDefaults}
                    style={{
                        padding: '6px 12px',
                        background: '#ecf0f1',
                        border: '1px solid #bdc3c7',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: '#666',
                        cursor: 'pointer'
                    }}
                >
                    Reset Defaults
                </button>
            </div>

            <div style={{ border: '2px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
                {/* Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 180px 50px',
                    background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 100%)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.95rem'
                }}>
                    <div style={{ padding: '12px 10px', textAlign: 'center' }}>S.No.</div>
                    <div style={{ padding: '12px 14px' }}>{col2Label}</div>
                    <div style={{ padding: '12px 14px', textAlign: 'right' }}>{col3Label} ({currency})*</div>
                    <div style={{ padding: '12px 10px' }}></div>
                </div>

                {/* Rows */}
                {feeItems.map((item, index) => (
                    <div key={index} style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 180px 50px',
                        borderTop: '1px solid #e0e0e0',
                        alignItems: 'center',
                        background: index % 2 === 0 ? 'white' : '#fafafa'
                    }}>
                        <div style={{ padding: '10px', textAlign: 'center', fontWeight: '500', color: '#666' }}>
                            {index + 1}
                        </div>
                        <div style={{ padding: '8px 14px' }}>
                            <input
                                type="text"
                                value={item.service}
                                onChange={(e) => updateRow(index, 'service', e.target.value)}
                                placeholder="Enter service name"
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ padding: '8px 14px' }}>
                            <input
                                type="text"
                                value={item.amount}
                                onChange={(e) => updateRow(index, 'amount', e.target.value)}
                                placeholder="0"
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem',
                                    textAlign: 'right',
                                    fontWeight: '600',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ padding: '8px', textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={() => removeRow(index)}
                                disabled={feeItems.length === 1}
                                style={{
                                    background: feeItems.length === 1 ? '#f5f5f5' : '#fee2e2',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px',
                                    cursor: feeItems.length === 1 ? 'not-allowed' : 'pointer',
                                    color: feeItems.length === 1 ? '#ccc' : '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Trash2 style={{ width: '14px', height: '14px' }} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Total Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 180px 50px',
                    borderTop: '2px solid #e0e0e0',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%)',
                    alignItems: 'center'
                }}>
                    <div style={{ padding: '12px' }}></div>
                    <div style={{ padding: '12px 14px', fontWeight: '700', color: '#2c3e50' }}>Total</div>
                    <div style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '700', fontSize: '1.05rem', color: '#0077B6' }}>
                        {currency} {formatCostWithCommas(totalAmount)}
                    </div>
                    <div style={{ padding: '12px' }}></div>
                </div>
            </div>

            {/* Add Row Button */}
            <button
                type="button"
                onClick={addRow}
                style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: '#f0f9ff',
                    border: '2px dashed #0077B6',
                    borderRadius: '8px',
                    color: '#0077B6',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    width: '100%',
                    justifyContent: 'center'
                }}
            >
                <Plus style={{ width: '16px', height: '16px' }} />
                Add Row
            </button>

            {footnote && (
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                    {footnote}
                </p>
            )}
        </div>
    );
};

export default FeeTable;
