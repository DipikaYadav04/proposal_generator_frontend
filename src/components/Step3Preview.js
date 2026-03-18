import React from 'react';
import { testDownloadEndpoint, debugBackendResponse } from '../services/proposalService';

const Step3Preview = ({ formData, handlePrevious, isSubmitting, generatedFilename, handleDownload }) => {
    // Service type checks
    const isTemplate2 = formData.template === 'template2';
    const isFullService = !isTemplate2 && formData.template !== '';

    // Service display names mapping
    const serviceNames = {
        'energy-audit': 'Energy Audit (Industry)',
        'water-audit': 'Water Audit',
        'fls-audit': 'FLS Audit',
        'hotel-audit': 'Hotel Energy Audit',
        'mep-proposal': 'MEP Proposal',
        'igbc-new-building': 'IGBC New Building',
        'igbc-existing-building': 'IGBC Existing Building',
        'igbc-green-campus': 'IGBC Green Campus',
        'igbc-green-factory': 'IGBC Green Factory Certification',
        'igbc-green-healthcare': 'IGBC Green Healthcare',
        'igbc-green-homes': 'IGBC Green Homes',
        'igbc-green-school': 'IGBC Green School',
        'igbc-green-health-wellbeing': 'IGBC Green Health & Well-Being Certification',
        'igbc-green-services-building': 'IGBC Green Services Building Certification',
        'igbc-green-resort': 'IGBC Green Resort',
        'igbc-green-interiors': 'IGBC Green Interiors Certification',
        'igbc-mrts': 'IGBC MRTS Certification',
        'igbc-net-zero': 'IGBC Net Zero Certification',
        'leed-hospitality': 'LEED Certification: Hospitality',
        'leed-core-shell': 'LEED Certification: Core & Shell',
        'leed-nc': 'LEED NC Certification',
        'leed-new-construction': 'LEED New Construction',
        'leed-ebom': 'LEED EBOM',
        'leed-net-zero-carbon': 'LEED Net Zero Carbon',
        'leed-zero-water': 'LEED Zero Water Certification',
        'leed-idci': 'LEED v4 ID+CI Certification',
        'edge-consultancy-audit': 'EDGE Consultancy & Audit',
        'ecbc-a': 'ECBC Form A',
        'ecbc-bc': 'ECBC Form B&C',
        'ecbc-abc': 'ECBC Form A, B & C',
        'template2': 'Simple Proposal'
    };

    const serviceName = serviceNames[formData.template] || 'Proposal';

    const numberToWordsIndian = (num) => {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
            'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
            'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const twoDigits = (n) => {
            if (n < 20) return ones[n];
            return (tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')).trim();
        };
        const threeDigits = (n) => {
            if (n >= 100) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + twoDigits(n % 100) : '');
            return twoDigits(n);
        };

        if (!num || num === 0) return 'Zero';
        try { num = parseInt(String(num).replace(/,/g, ''), 10); } catch { return String(num); }
        if (isNaN(num)) return '';

        const parts = [];
        if (num >= 10000000) { parts.push(twoDigits(Math.floor(num / 10000000)) + ' Crore'); num %= 10000000; }
        if (num >= 100000) { parts.push(twoDigits(Math.floor(num / 100000)) + ' Lakh'); num %= 100000; }
        if (num >= 1000) { parts.push(twoDigits(Math.floor(num / 1000)) + ' Thousand'); num %= 1000; }
        if (num > 0) parts.push(threeDigits(num));
        return parts.join(' ') + ' Only';
    };

    // Format cost with Indian comma style for display
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

    // Format date to words format for display (e.g., "10th October 2025")
    const formatDateForDisplay = (dateString) => {
      if (!dateString) return 'Not provided';
      
      const [year, month, day] = dateString.split('-');
      
      // Month names
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      // Get month name
      const monthName = months[parseInt(month) - 1];
      
      // Add ordinal suffix (st, nd, rd, th)
      const dayNum = parseInt(day);
      let suffix = 'th';
      
      if (dayNum === 1 || dayNum === 21 || dayNum === 31) {
        suffix = 'st';
      } else if (dayNum === 2 || dayNum === 22) {
        suffix = 'nd';
      } else if (dayNum === 3 || dayNum === 23) {
        suffix = 'rd';
      }
      
      return `${dayNum}${suffix} ${monthName} ${year}`;
    };    // Debug logging
    console.log('🔍 Step3Preview Debug:', {
        isSubmitting,
        generatedFilename,
        hasHandleDownload: typeof handleDownload === 'function',
        serviceType: formData.template,
        serviceName: serviceName
    });

    return (
        <div className="form-step">
            <h2>Step 3: Review Your Proposal</h2>
            
            {/* Service Badge - Show for all non-empty selections */}
            {isFullService && (
                <p className="template-badge" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
                    {serviceName}
                </p>
            )}
            {isTemplate2 && (
                <p className="template-badge template-2">
                    {serviceName}
                </p>
            )}
            
            <div className="preview-section">
                <h3 className="preview-heading">Basic Information</h3>
                <div className="preview-grid">
                    <div className="preview-item">
                        <span className="preview-label">Proposal Name:</span>
                        <span className="preview-value">{formData.clientName || 'Not provided'}</span>
                    </div>
                    <div className="preview-item">
                        <span className="preview-label">Submitted to:</span>
                        <span className="preview-value">{formData.submittedTo || 'Not provided'}</span>
                    </div>
                    <div className="preview-item">
                        <span className="preview-label">Date:</span>
                        <span className="preview-value">{formatDateForDisplay(formData.date)}</span>
                    </div>
                </div>
            </div>

            {/* Financial Details - IGBC Net Zero with 3 council fee tables */}
            {formData.template === 'igbc-net-zero' ? (
                <div className="preview-section">
                    <h3 className="preview-heading">Fee Structure</h3>
                    <div className="preview-grid">
                        <div className="preview-item">
                            <span className="preview-label">Currency:</span>
                            <span className="preview-value">{formData.currency || 'INR'}</span>
                        </div>
                        {formData.cost && (
                            <div className="preview-item">
                                <span className="preview-label">Consultancy Cost:</span>
                                <span className="preview-value">{formData.currency || 'INR'} {formatCostWithCommas(formData.cost)}</span>
                            </div>
                        )}
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2c3e50', margin: '16px 0 8px 0' }}>
                        Council Fees
                    </h4>
                    {[
                        { label: 'IGBC NET Zero Energy', reg: formData.registrationFeesE, cert: formData.certificationFeesE },
                        { label: 'IGBC NET Zero Water', reg: formData.registrationFeesW, cert: formData.certificationFeesW },
                        { label: 'IGBC NET Zero Waste', reg: formData.registrationFeesWa, cert: formData.certificationFeesWa },
                    ].map((section, idx) => {
                        const regVal = parseInt((section.reg || '0').toString().replace(/,/g, ''), 10) || 0;
                        const certVal = parseInt((section.cert || '0').toString().replace(/,/g, ''), 10) || 0;
                        return (
                            <div key={idx} style={{ marginBottom: '12px' }}>
                                <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 150px', background: '#f8f9fa', fontWeight: '600', fontSize: '0.9rem' }}>
                                        <div style={{ padding: '10px', textAlign: 'center' }}>S.No.</div>
                                        <div style={{ padding: '10px' }}>Service for {section.label}</div>
                                        <div style={{ padding: '10px', textAlign: 'right' }}>Fees ({formData.currency || 'INR'})*</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 150px', borderTop: '1px solid #e0e0e0' }}>
                                        <div style={{ padding: '10px', textAlign: 'center' }}>1</div>
                                        <div style={{ padding: '10px' }}>Registration</div>
                                        <div style={{ padding: '10px', textAlign: 'right' }}>{formatCostWithCommas(section.reg) || '—'}</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 150px', borderTop: '1px solid #e0e0e0' }}>
                                        <div style={{ padding: '10px', textAlign: 'center' }}>2</div>
                                        <div style={{ padding: '10px' }}>Certification</div>
                                        <div style={{ padding: '10px', textAlign: 'right' }}>{formatCostWithCommas(section.cert) || '—'}</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 150px', borderTop: '1px solid #e0e0e0', background: '#f0f9f4', fontWeight: '700' }}>
                                        <div style={{ padding: '10px' }}></div>
                                        <div style={{ padding: '10px' }}>Total</div>
                                        <div style={{ padding: '10px', textAlign: 'right', color: '#27AE60' }}>{formatCostWithCommas(regVal + certVal)}</div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic', margin: '4px 0 0 0' }}>*GST Extra</p>
                            </div>
                        );
                    })}
                </div>
            ) : (formData.template === 'igbc-existing-building' || formData.template === 'igbc-green-services-building' || formData.template === 'igbc-green-interiors') ? (
                <div className="preview-section">
                    <h3 className="preview-heading">Fee Structure</h3>
                    <div className="preview-grid">
                        <div className="preview-item">
                            <span className="preview-label">Currency:</span>
                            <span className="preview-value">{formData.currency || 'INR'}</span>
                        </div>
                        {formData.cost && (
                            <div className="preview-item">
                                <span className="preview-label">Consultancy Cost:</span>
                                <span className="preview-value">{formData.currency || 'INR'} {formatCostWithCommas(formData.cost)}</span>
                            </div>
                        )}
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2c3e50', margin: '16px 0 8px 0' }}>
                        {(formData.template === 'igbc-green-services-building' || formData.template === 'igbc-green-interiors') ? 'Council Fees' : 'IGBC Fee Structure'}
                    </h4>
                    <div style={{ 
                        border: '1px solid #e0e0e0', 
                        borderRadius: '8px', 
                        overflow: 'hidden'
                    }}>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '50px 1fr 150px',
                            background: '#f8f9fa',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                        }}>
                            <div style={{ padding: '10px', textAlign: 'center' }}>S.No.</div>
                            <div style={{ padding: '10px' }}>Service</div>
                            <div style={{ padding: '10px', textAlign: 'right' }}>Fees ({formData.currency || 'INR'})*</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 150px', borderTop: '1px solid #e0e0e0' }}>
                            <div style={{ padding: '10px', textAlign: 'center' }}>1</div>
                            <div style={{ padding: '10px' }}>Registration Fees</div>
                            <div style={{ padding: '10px', textAlign: 'right' }}>{formatCostWithCommas(formData.registrationCost) || '—'}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 150px', borderTop: '1px solid #e0e0e0' }}>
                            <div style={{ padding: '10px', textAlign: 'center' }}>2</div>
                            <div style={{ padding: '10px' }}>Certification Fees</div>
                            <div style={{ padding: '10px', textAlign: 'right' }}>{formatCostWithCommas(formData.certificationCost) || '—'}</div>
                        </div>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '50px 1fr 150px', 
                            borderTop: '1px solid #e0e0e0',
                            background: '#f0f9f4',
                            fontWeight: '700'
                        }}>
                            <div style={{ padding: '10px' }}></div>
                            <div style={{ padding: '10px' }}>Total Fees</div>
                            <div style={{ padding: '10px', textAlign: 'right', color: '#27AE60' }}>
                                {(() => {
                                    const reg = parseInt((formData.registrationCost || '0').toString().replace(/,/g, ''), 10) || 0;
                                    const cert = parseInt((formData.certificationCost || '0').toString().replace(/,/g, ''), 10) || 0;
                                    return formatCostWithCommas(reg + cert);
                                })()}
                            </div>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                        * Taxes applicable extra as per government norms
                    </p>
                </div>
            ) : (
                <div className="preview-section">
                    <h3 className="preview-heading">Financial Details</h3>
                    <div className="preview-grid">
                        <div className="preview-item">
                            <span className="preview-label">Currency:</span>
                            <span className="preview-value">{formData.currency || 'Not provided'}</span>
                        </div>
                        <div className="preview-item">
                            <span className="preview-label">Cost:</span>
                            <span className="preview-value">
                                {formData.cost ? `${formData.currency} ${formatCostWithCommas(formData.cost)}` : 'Not provided'}
                            </span>
                        </div>
                        {formData.cost && (
                            <div className="preview-item">
                                <span className="preview-label">Cost (In Words):</span>
                                <span className="preview-value" style={{ fontStyle: 'italic' }}>
                                    {numberToWordsIndian(formData.cost)}
                                </span>
                            </div>
                        )}
                        {formData.template === 'igbc-green-factory' && formData.area && (
                            <div className="preview-item">
                                <span className="preview-label">Area:</span>
                                <span className="preview-value">{formatCostWithCommas(formData.area)} Sqm</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Show Project Details for all full services (not template2) */}
            {isFullService && (
                <div className="preview-section">
                    <h3 className="preview-heading">{serviceName} Details</h3>
                    {(formData.projectName || formData.cityName || formData.areaSqFt) && (
                        <div className="preview-grid">
                            {formData.projectName && (
                                <div className="preview-item">
                                    <span className="preview-label">Project Name:</span>
                                    <span className="preview-value">{formData.projectName}</span>
                                </div>
                            )}
                            {formData.cityName && (
                                <div className="preview-item">
                                    <span className="preview-label">City:</span>
                                    <span className="preview-value">{formData.cityName}</span>
                                </div>
                            )}
                            {formData.areaSqFt && (
                                <div className="preview-item">
                                    <span className="preview-label">Area:</span>
                                    <span className="preview-value">{formatCostWithCommas(formData.areaSqFt)} Sq. Ft.</span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="preview-item full-width">
                        <span className="preview-label">Project Overview:</span>
                        <p className="preview-text">{formData.projectDescription || 'Not provided'}</p>
                    </div>
                    <div className="preview-item full-width">
                        <span className="preview-label">Terms and Conditions:</span>
                        {formData.termsAndConditions && formData.termsAndConditions.length > 0 ? (
                            <ol className="preview-terms-list">
                                {formData.termsAndConditions.map((term, index) => (
                                    <li key={index}>{term}</li>
                                ))}
                            </ol>
                        ) : (
                            <p className="preview-text">No terms selected</p>
                        )}
                    </div>
                    {formData.template === 'igbc-net-zero' ? (
                        <>
                            {[
                                { label: 'Payment Schedule — Energy', data: formData.paymentScheduleEnergy },
                                { label: 'Payment Schedule — Water', data: formData.paymentScheduleWater },
                                { label: 'Payment Schedule — Waste', data: formData.paymentScheduleWaste },
                            ].map((schedule, idx) => (
                                <div key={idx} className="preview-item full-width" style={{ marginTop: idx > 0 ? '12px' : 0 }}>
                                    <span className="preview-label">{schedule.label}:</span>
                                    {schedule.data && schedule.data.length > 0 ? (
                                        <div className="preview-payment-schedule">
                                            {schedule.data.map((item, index) => (
                                                <div key={index} className="preview-payment-item">
                                                    <span className="payment-milestone">{index + 1}. {item.title}</span>
                                                    <span className="payment-percent">{item.percent}%</span>
                                                </div>
                                            ))}
                                            <div className="preview-payment-total">
                                                <span>Total:</span>
                                                <span>{schedule.data.reduce((sum, item) => sum + item.percent, 0).toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="preview-text">No payment schedule added</p>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="preview-item full-width">
                            <span className="preview-label">Payment Schedule:</span>
                            {formData.paymentSchedule && formData.paymentSchedule.length > 0 ? (
                                <div className="preview-payment-schedule">
                                    {formData.paymentSchedule.map((item, index) => (
                                        <div key={index} className="preview-payment-item">
                                            <span className="payment-milestone">{index + 1}. {item.title}</span>
                                            <span className="payment-percent">{item.percent}%</span>
                                        </div>
                                    ))}
                                    <div className="preview-payment-total">
                                        <span>Total:</span>
                                        <span>{formData.paymentSchedule.reduce((sum, item) => sum + item.percent, 0).toFixed(1)}%</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="preview-text">No payment schedule added</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Show simplified message for Template 2 */}
            {isTemplate2 && (
                <div className="preview-section">
                    <h3 className="preview-heading">Quick Proposal Summary</h3>
                    <p className="preview-note">
                        ✓ This is a simplified proposal with essential information only.
                    </p>
                </div>
            )}

            <div className="button-group">
                <button 
                    type="button" 
                    onClick={handlePrevious} 
                    className="btn-previous"
                    disabled={isSubmitting}
                >
                    Previous
                </button>
                
                {!generatedFilename ? (
                    <button 
                        type="submit" 
                        className="btn-submit"
                        disabled={isSubmitting}
                        style={{
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? '⏳ Generating...' : '📄 Generate Proposal'}
                    </button>
                ) : (
                    <button 
                        type="button" 
                        onClick={handleDownload}
                        className="btn-submit"
                        style={{
                            background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)'
                        }}
                    >
                        ⬇️ Download Proposal
                    </button>
                )}
                
                {/* Debug/Test Buttons - Always visible in development */}
                {process.env.NODE_ENV === 'development' && (
                    <>
                        <button 
                            type="button" 
                            onClick={async () => {
                                console.log('🔍 Debugging backend response structure...');
                                const result = await debugBackendResponse(formData);
                                console.log('🔍 Debug result:', result);
                                if (result.success) {
                                    alert(`🔍 Backend Response Analysis:\n\n` +
                                          `Response Type: ${result.analysis.responseType}\n` +
                                          `Available Keys: ${result.analysis.keys.join(', ')}\n\n` +
                                          `Expected Pattern:\n${result.analysis.expectedPattern}\n\n` +
                                          `Example:\n${result.analysis.exampleFilename}\n\n` +
                                          `Actual Filename:\n${result.analysis.actualFilename}\n\n` +
                                          `Valid Format: ${result.analysis.hasValidFilename ? '✅ Yes' : '❌ No'}\n\n` +
                                          `Check console for full details.`);
                                } else {
                                    alert(`❌ Debug failed: ${result.error}`);
                                }
                            }}
                            style={{
                                background: 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginLeft: '10px'
                            }}
                        >
                            🔍 Debug Backend
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={async () => {
                                console.log('🧪 Testing download endpoint...');
                                const testFilename = generatedFilename || 'test-file.pdf';
                                const result = await testDownloadEndpoint(testFilename);
                                alert(`Endpoint Test: ${result.success ? '✅' : '❌'} ${result.message}`);
                            }}
                            style={{
                                background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginLeft: '10px'
                            }}
                        >
                            🧪 Test Endpoint
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => {
                                console.log('🔧 Debug Info:');
                                console.log('Generated filename:', generatedFilename);
                                console.log('Is submitting:', isSubmitting);
                                console.log('HandleDownload available:', typeof handleDownload);
                                if (generatedFilename && handleDownload) {
                                    console.log('🚀 Force download attempt...');
                                    handleDownload();
                                } else {
                                    alert('❌ Cannot download: ' + 
                                          (!generatedFilename ? 'No filename' : 'No handler'));
                                }
                            }}
                            style={{
                                background: 'linear-gradient(135deg, #E67E22 0%, #D35400 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginLeft: '10px'
                            }}
                        >
                            🔧 Test Download
                        </button>
                    </>
                )}
            </div>

            {generatedFilename && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: 'rgba(46, 204, 113, 0.1)',
                    border: '2px solid rgba(46, 204, 113, 0.3)',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <p style={{ 
                        margin: 0, 
                        color: '#27AE60', 
                        fontWeight: '600',
                        fontSize: '0.95rem'
                    }}>
                        ✅ Proposal Generated Successfully!
                    </p>
                    <p style={{ 
                        margin: '8px 0 0 0', 
                        color: '#666', 
                        fontSize: '0.85rem'
                    }}>
                        File: <strong>{generatedFilename}</strong>
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <p style={{ 
                            margin: '8px 0 0 0', 
                            color: '#999', 
                            fontSize: '0.8rem',
                            fontFamily: 'monospace'
                        }}>
                            🔧 Debug: Filename = "{generatedFilename}"
                        </p>
                    )}
                </div>
            )}
            
            {/* Debug Info - Development Only */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    background: 'rgba(52, 152, 219, 0.1)',
                    border: '1px solid rgba(52, 152, 219, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#2c3e50'
                }}>
                    <strong>🔧 Debug Info:</strong><br/>
                    • generatedFilename: {generatedFilename || 'null'}<br/>
                    • isSubmitting: {isSubmitting.toString()}<br/>
                    • handleDownload: {typeof handleDownload === 'function' ? 'available' : 'missing'}
                </div>
            )}
        </div>
    );
};

export default Step3Preview;
