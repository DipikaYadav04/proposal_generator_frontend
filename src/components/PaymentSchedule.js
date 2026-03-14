import React from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';

const PaymentSchedule = ({ paymentItems = [], setPaymentItems, serviceType = 'energy-audit' }) => {
  const addPaymentItem = () => {
    setPaymentItems([...paymentItems, { title: '', percent: 0 }]);
  };

  const removePaymentItem = (index) => {
    if (paymentItems.length > 1) {
      setPaymentItems(paymentItems.filter((_, i) => i !== index));
    }
  };

  const updatePaymentItem = (index, field, value) => {
    const updated = paymentItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: field === 'percent' ? parseFloat(value) || 0 : value };
      }
      return item;
    });
    setPaymentItems(updated);
  };

  const totalPercent = paymentItems.reduce((sum, item) => sum + item.percent, 0);
  const isValidTotal = Math.abs(totalPercent - 100) < 0.01;

  // Service-specific default payment milestones
  const getDefaultMilestones = (service) => {
    switch(service) {
      case 'energy-audit':
        return [
          { title: 'Along with Work order', percent: 30 },
          { title: 'At the time of Design delivery', percent: 40 },
          { title: 'At the time of Final delivery', percent: 30 }
        ];
      
      case 'water-audit':
        return [
          { title: 'Along with Work order', percent: 50 },
          { title: 'After Submission of Water Audit Report', percent: 50 }
        ];
      
      case 'fls-audit':
        return [
          { title: 'Along with Work order', percent: 20 },
          { title: 'After the submission of FLS Snag List', percent: 30 },
          { title: 'After the testing of Fire Fighting Systems', percent: 30 },
          { title: 'After final report submission', percent: 20 }
        ];
      
      case 'hotel-audit':
        return [
          { title: 'Along with Work order', percent: 50 },
          { title: 'After Submission of Energy Audit Report', percent: 50 }
        ];
      
      case 'mep-proposal':
        return [
          { title: 'Along with work order', percent: 30 },
          { title: 'Against Finalisation of conceptual design', percent: 30 },
          { title: 'Against Finalisation of detailed design drawings', percent: 20 },
          { title: 'After Submission of BOQ', percent: 20 }
        ];
      
      case 'igbc-new-building':
        return [
          { title: 'Along with work order', percent: 10 },
          { title: 'On submission of detailed feasibility report', percent: 15 },
          { title: 'On submission of Energy & Daylight Simulation Report', percent: 20 },
          { title: 'On Preliminary submission to IGBC', percent: 20 },
          { title: 'On final Submission to IGBC', percent: 20 },
          { title: 'On Award of Rating', percent: 15 }
        ];
      
      case 'igbc-existing-building':
        return [
          { title: 'Along With Work order', percent: 20 },
          { title: 'After conducting site Audits', percent: 30 },
          { title: 'On Preliminary submission to IGBC', percent: 20 },
          { title: 'On Final submission to IGBC', percent: 20 },
          { title: 'Award of certificate', percent: 10 }
        ];
      
      case 'igbc-green-campus':
        return [
          { title: 'Along with work order', percent: 20 },
          { title: 'On Submission of Detailed Feasibility Report', percent: 20 },
          { title: 'On Submission of Day light and Energy simulation', percent: 20 },
          { title: 'On Preliminary Submission to IGBC', percent: 20 },
          { title: 'Final Submission to IGBC', percent: 10 },
          { title: 'On Award Rating from IGBC', percent: 10 }
        ];
      
      case 'ecbc-a':
      case 'ecbc-bc':
      case 'ecbc-abc':
        return [
          { title: 'Along with the work order', percent: 50 },
          { title: 'After submission of ECBC reports', percent: 50 }
        ];
      
      case 'igbc-green-factory':
        return [
          { title: 'Advance along with the Work order', percent: 15 },
          { title: 'After Submission of Feasibility Report', percent: 15 },
          { title: 'After Submission of Energy & Daylight Modelling Report OPR/BOD', percent: 15 },
          { title: 'On 1st submission of Certification Documentation to IGBC', percent: 20 },
          { title: 'On 2nd submission of Certification Documentation to IGBC', percent: 20 },
          { title: 'On Award of Certification Rating', percent: 15 }
        ];
      
      case 'igbc-green-healthcare':
        return [
          { title: 'Along with work order', percent: 20 },
          { title: 'On submission of feasibility & Preliminary Design Review', percent: 20 },
          { title: 'On submission of Energy Modelling Report & Daylighting Modelling Report', percent: 25 },
          { title: 'On Submission of Certification documentation to IGBC', percent: 25 },
          { title: 'On Award of Rating from IGBC', percent: 10 }
        ];
      
      case 'igbc-green-health-wellbeing':
        return [
          { title: 'Along with work order', percent: 20 },
          { title: 'On submission of feasibility report', percent: 10 },
          { title: 'On First Submission of Certification documentation to IGBC', percent: 30 },
          { title: 'On Second Submission of Certification documentation to IGBC', percent: 30 },
          { title: 'On Award of Rating from IGBC', percent: 10 }
        ];
      
      case 'igbc-green-services-building':
        return [
          { title: 'Along with work order', percent: 20 },
          { title: 'On submission of feasibility, daylight & Energy simulation', percent: 40 },
          { title: 'On First Submission to IGBC', percent: 30 },
          { title: 'On Award of Rating from IGBC', percent: 10 }
        ];
      
      case 'igbc-green-resort':
        return [
          { title: 'Along with work order', percent: 10 },
          { title: 'Pre-Design stage / feasibility', percent: 10 },
          { title: 'Schematic Design stage / simulation', percent: 15 },
          { title: 'Design Development Stage/ 1st submission to IGBC', percent: 15 },
          { title: 'Construction Documentation/ On award of precertification', percent: 15 },
          { title: 'Construction Administration/ On submission of final documentation to IGBC', percent: 15 },
          { title: 'Post Construction Services / award of final rating', percent: 20 }
        ];
      
      case 'igbc-green-interiors':
        return [
          { title: 'Along with work order', percent: 30 },
          { title: 'On submission to IGBC', percent: 50 },
          { title: 'On Award of Final Certification Rating', percent: 20 }
        ];
      
      case 'igbc-mrts':
        return [
          { title: 'Advance with work order', percent: 20 },
          { title: 'Total fee upon submitting detail feasibility study report and responsibility matrix', percent: 20 },
          { title: 'Submission of Energy Simulation report to IGBC', percent: 30 },
          { title: 'After the first submission to IGBC', percent: 20 },
          { title: 'After receiving the IGBC rating', percent: 10 }
        ];
      
      case 'igbc-green-homes':
        return [
          { title: 'Advance on Appointment', percent: 15 },
          { title: 'On Submission of feasibility', percent: 15 },
          { title: 'On submission of daylight and energy simulation report', percent: 20 },
          { title: 'On Receipt of Pre-Certification', percent: 20 },
          { title: 'On first Submission to IGBC for final Certification', percent: 10 },
          { title: 'On Submission of final documents for Certification', percent: 10 },
          { title: 'On Receipt of Certification', percent: 10 }
        ];
      
      case 'igbc-green-school':
        return [
          { title: 'Advance along with work order', percent: 10 },
          { title: 'On submission of feasibility study', percent: 20 },
          { title: 'On submission of preliminary documentation to IGBC', percent: 30 },
          { title: 'On submission of review response to IGBC', percent: 20 },
          { title: 'On Award of Rating', percent: 20 }
        ];
      
      case 'leed-hospitality':
        return [
          { title: 'Along With Work order', percent: 20 },
          { title: 'Submission of Detailed Feasibility Report', percent: 20 },
          { title: 'Submission of Energy and Daylight Simulation Report', percent: 20 },
          { title: 'Preliminary submission to USGBC for Certification', percent: 15 },
          { title: 'Final submission to USGBC for Certification', percent: 15 },
          { title: 'Award of Final Certification', percent: 10 }
        ];
      
      case 'leed-nc':
        return [
          { title: 'Along With Work order', percent: 20 },
          { title: 'Submission of Detailed Feasibility Report', percent: 20 },
          { title: 'Submission of Energy and Daylight Simulation Report', percent: 20 },
          { title: 'Preliminary submission to USGBC for Certification', percent: 15 },
          { title: 'Final submission to USGBC for Certification', percent: 15 },
          { title: 'Award of Final Certification', percent: 10 }
        ];
      
      case 'leed-net-zero-carbon':
        return [
          { title: 'Along With Work order', percent: 30 },
          { title: 'Submission of Detailed Feasibility Report', percent: 30 },
          { title: 'Preliminary submission to USGBC for Certification', percent: 30 },
          { title: 'Final submission to USGBC for Certification', percent: 10 }
        ];
      
      case 'leed-zero-water':
        return [
          { title: 'Along with the work order', percent: 20 },
          { title: 'Preliminary submission', percent: 35 },
          { title: 'Final submission', percent: 35 },
          { title: 'Award of certificate', percent: 10 }
        ];
      
      case 'leed-idci':
        return [
          { title: 'Along With Work order', percent: 15 },
          { title: 'On Submission of detailed Feasibility Report', percent: 20 },
          { title: 'On Submission of Energy Modelling and Daylight Report', percent: 25 },
          { title: 'Preliminary submission to USGBC', percent: 15 },
          { title: 'Final submission to USGBC', percent: 15 },
          { title: 'On Award of LEED Certification', percent: 10 }
        ];
      
      case 'leed-ebom':
        return [
          { title: 'Submission of Preliminary Feasibility Report', percent: 25 },
          { title: 'On submission of project to USGBC Council', percent: 25 },
          { title: 'On submission of review response to USGBC Council', percent: 25 },
          { title: 'On receipt of green building certificate i.e. LEED EBOM', percent: 25 }
        ];
      
      default:
        return [
          { title: 'Along with Work order', percent: 30 },
          { title: 'At the time of Design delivery', percent: 40 },
          { title: 'At the time of Final delivery', percent: 30 }
        ];
    }
  };

  const defaultMilestones = getDefaultMilestones(serviceType);

  const loadDefaultMilestones = () => {
    setPaymentItems(defaultMilestones);
  };

  return (
    <section style={{ width: '100%', maxWidth: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <Calculator style={{ width: '22px', height: '22px' }} />
          Payment Schedule
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {paymentItems.length === 0 && (
            <button
              type="button"
              onClick={loadDefaultMilestones}
              style={{
                fontSize: '0.9rem',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.3)';
              }}
            >
              Load Default Schedule
            </button>
          )}
          <button
            type="button"
            onClick={addPaymentItem}
            style={{
              fontSize: '0.9rem',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(46, 204, 113, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 204, 113, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(46, 204, 113, 0.3)';
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Add Milestone
          </button>
        </div>
      </div>

      {/* Payment Items List */}
      {paymentItems.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          {paymentItems.map((item, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '15px',
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#3498DB';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{
                flexShrink: 0,
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                fontWeight: '700',
                marginTop: '4px',
                boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)'
              }}>
                {index + 1}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#555',
                    marginBottom: '6px'
                  }}>
                    Milestone {index + 1}
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updatePaymentItem(index, 'title', e.target.value)}
                    placeholder="e.g., Along with Work order"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3498DB';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ width: '150px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#555',
                    marginBottom: '6px'
                  }}>
                    Percentage
                  </label>
                  <input
                    type="number"
                    value={item.percent}
                    onChange={(e) => updatePaymentItem(index, 'percent', e.target.value)}
                    min="0"
                    max="100"
                    step="0.1"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3498DB';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {paymentItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePaymentItem(index)}
                  style={{
                    flexShrink: 0,
                    padding: '10px',
                    color: '#e74c3c',
                    background: 'transparent',
                    border: '2px solid #e74c3c',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#e74c3c';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#e74c3c';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Trash2 style={{ width: '18px', height: '18px' }} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Total Percentage Display */}
      {paymentItems.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px',
          background: isValidTotal ? 'rgba(46, 204, 113, 0.05)' : totalPercent > 100 ? 'rgba(231, 76, 60, 0.05)' : 'rgba(241, 196, 15, 0.05)',
          borderRadius: '12px',
          border: `2px solid ${isValidTotal ? 'rgba(46, 204, 113, 0.3)' : totalPercent > 100 ? 'rgba(231, 76, 60, 0.3)' : 'rgba(241, 196, 15, 0.3)'}`,
          marginBottom: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calculator style={{ width: '20px', height: '20px', color: '#666' }} />
            <span style={{ fontWeight: '600', color: '#2c3e50', fontSize: '1rem' }}>Total Percentage:</span>
          </div>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            color: isValidTotal ? '#2ECC71' : totalPercent > 100 ? '#e74c3c' : '#F39C12'
          }}>
            {totalPercent.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Validation Message */}
      {paymentItems.length > 0 && !isValidTotal && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '10px',
          background: totalPercent > 100 ? 'rgba(231, 76, 60, 0.08)' : 'rgba(241, 196, 15, 0.08)',
          border: `2px solid ${totalPercent > 100 ? 'rgba(231, 76, 60, 0.3)' : 'rgba(241, 196, 15, 0.3)'}`,
          color: totalPercent > 100 ? '#c0392b' : '#d68910',
          marginBottom: '15px'
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>
            {totalPercent > 100 
              ? `⚠️ Percentages exceed 100% by ${(totalPercent - 100).toFixed(1)}%. Please adjust.`
              : `⚠️ Percentages total ${totalPercent.toFixed(1)}%. Add ${(100 - totalPercent).toFixed(1)}% more to reach 100%.`
            }
          </p>
        </div>
      )}

      {/* Empty State */}
      {paymentItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#95a5a6',
          background: 'rgba(52, 152, 219, 0.03)',
          borderRadius: '12px',
          border: '2px dashed #cbd5e0'
        }}>
          <Calculator style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 15px',
            color: '#cbd5e0'
          }} />
          <p style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: '#7f8c8d',
            margin: '0 0 8px 0'
          }}>
            No payment milestones added yet.
          </p>
          <p style={{
            fontSize: '0.9rem',
            color: '#95a5a6',
            margin: 0
          }}>
            Click "Load Default Schedule" or "Add Milestone" to get started.
          </p>
        </div>
      )}
    </section>
  );
};

export default PaymentSchedule;
