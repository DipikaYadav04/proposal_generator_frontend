import React from 'react';
import TermsAndConditions from '../TermsAndConditions';
import PaymentSchedule from '../PaymentSchedule';
import ProjectOverviewGenerator from '../ProjectOverviewGenerator';
import { Building2 } from 'lucide-react';

const Step2FormLEEDCommissioning = ({
  formData,
  handleChange,
  handlePrevious,
  handleTermsChange,
  handlePaymentScheduleChange,
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

  const handleNumberChange = (fieldName) => (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    handleChange({
      target: { name: fieldName, value: formatCostWithCommas(inputValue) }
    });
  };

  return (
    <div className="form-step">
      <h2>Step 2: LEED Commissioning</h2>
      <p className="template-badge" style={{ background: 'linear-gradient(135deg, #0077B6 0%, #023E8A 100%)' }}>
        <Building2 style={{ width: '16px', height: '16px', marginRight: '6px', display: 'inline' }} />
        LEED Commissioning
      </p>

      <div className="form-group">
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          value={formData.projectName || ''}
          onChange={handleChange}
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="area">Area:</label>
        <input
          type="text"
          id="area"
          name="area"
          value={formData.area || ''}
          onChange={handleChange}
          placeholder="Enter area (as per proposal)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="fundamentalCxFees">Fundamental Cx Fees:</label>
        <input
          type="text"
          id="fundamentalCxFees"
          name="fundamentalCxFees"
          value={formatCostWithCommas(formData.fundamentalCxFees)}
          onChange={handleNumberChange('fundamentalCxFees')}
          placeholder="e.g., 1,00,000"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="enhancedCxFees">Enhanced Cx Fees:</label>
        <input
          type="text"
          id="enhancedCxFees"
          name="enhancedCxFees"
          value={formatCostWithCommas(formData.enhancedCxFees)}
          onChange={handleNumberChange('enhancedCxFees')}
          placeholder="e.g., 1,50,000"
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

export default Step2FormLEEDCommissioning;

