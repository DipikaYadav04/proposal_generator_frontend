import axios from 'axios';

// API Configuration
// Development: http://localhost:8000 (Localhost for testing)
// Production: https://fastapi-backend-proposal.onrender.com
const DEVELOPMENT_URL = 'http://localhost:8000';
const PRODUCTION_URL = 'https://fastapi-backend-proposal.onrender.com';

// Check if we're in development mode or if REACT_APP_USE_LOCAL is set
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_LOCAL === 'true';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (isDevelopment ? DEVELOPMENT_URL : PRODUCTION_URL);

// API Key for authentication (from environment variable)
const API_KEY = process.env.REACT_APP_API_KEY || '';

console.log('🔧 API Configuration:', {
  mode: process.env.NODE_ENV,
  useLocal: process.env.REACT_APP_USE_LOCAL,
  selectedURL: API_BASE_URL,
  isDevelopment: isDevelopment,
  hasApiKey: !!API_KEY
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'X-API-Key': API_KEY }), // Include API key if available
  },
  timeout: 60000, // 60 seconds for generation
  withCredentials: true, // Include cookies for authentication
});

/**
 * Generate Energy Audit Proposal
 * 
 * BACKEND FILENAME GENERATION:
 * Pattern: Energy Audit (Industry)_{ClientName}_{Date}_{Time}.docx
 * Example: Energy Audit (Industry)_ABC_Manufacturing_Ltd_20250926_151412.docx
 * 
 * Components:
 * - Prefix: "Energy Audit (Industry)"
 * - Client Name: Sanitized client name (spaces → underscores, special chars removed)
 * - Date: YYYYMMDD format
 * - Time: HHMMSS format (24-hour)
 * - Extension: .docx
 * 
 * Backend Response Structure:
 * {
 *   "filename": "Energy Audit (Industry)_ABC_Manufacturing_Ltd_20250926_151412.docx",
 *   "status": "success", 
 *   "message": "Proposal generated successfully"
 * }
 * 
 * @param {Object} formData - Form data from the frontend
 * @returns {Promise<Object>} Response with backend-generated filename, status, and message
 */
export const generateProposal = async (formData) => {
  try {
    // Frontend validation before sending to backend
    
    // 1. Validate project overview word count (max 100 words)
    const projectDescription = formData.projectDescription || '';
    const words = projectDescription.split(/\s+/).filter(word => word.trim().length > 0);
    const wordCount = words.length;
    if (wordCount > 100) {
      throw new Error(`Project overview must not exceed 100 words. Current: ${wordCount} words.`);
    }
    
    // 2. Validate payment schedule percentages
    const paymentSchedule = formData.paymentSchedule || [];
    if (paymentSchedule.length === 0) {
      throw new Error('At least one payment milestone is required.');
    }
    
    // Convert to floats and validate total equals exactly 100.0
    const percentages = paymentSchedule.map(item => {
      const percent = parseFloat(item.percent || 0);
      if (percent < 0 || percent > 100) {
        throw new Error(`Payment percentage must be between 0-100%. Found: ${percent}%`);
      }
      return percent;
    });
    
    const totalPercentage = percentages.reduce((sum, percent) => sum + percent, 0);
    if (Math.abs(totalPercentage - 100.0) > 0.01) {
      throw new Error(`Payment schedule must total exactly 100.0%. Current total: ${totalPercentage.toFixed(1)}%`);
    }

    // Map frontend template values to backend .docx filenames
    const templateMap = {
      'energy-audit': 'Energy Audit (Industry).docx',
      'water-audit': 'Water Audit.docx',
      'fls-audit': 'FLS Audit.docx',
      'hotel-audit': 'Audit for Hotel.docx',
      'mep-proposal': 'MEP Proposal.docx',
      'igbc-new-building': 'IGBC New Building.docx',
      'igbc-existing-building': 'IGBC Existing Building.docx',
      'igbc-green-campus': 'IGBC Green Campus.docx',
      'igbc-green-factory': 'IGBC Green Factory Certification.docx',
      'igbc-green-healthcare': 'IGBC Green Healthcare.docx',
      'igbc-green-homes': 'IGBC Green Homes.docx',
      'igbc-green-school': 'IGBC Green School.docx',
      'igbc-green-health-wellbeing': 'IGBC Green Health and Well-Being Certification.docx',
      'igbc-green-services-building': 'IGBC Green Services Building Certification.docx',
      'igbc-green-resort': 'IGBC Green Resort.docx',
      'igbc-green-interiors': 'IGBC Green Interiors certification.docx',
      'igbc-mrts': 'IGBC MRTS Certification.docx',
      'igbc-net-zero': 'IGBC Net Zero Certification  1.docx',
      'ecbc-a': 'Proposal for ECBC Compliance A.docx',
      'ecbc-bc': 'Proposal for ECBC Compliance B& C.docx',
      'ecbc-abc': 'Proposal for ECBC Compliance A, B& C.docx',
      'edge-consultancy-audit': 'EDGE Consultancy & Audit Draft Placeholder.docx',
      'template2': 'Other Service.docx'
    };

    // Get the correct template name, fallback to Energy Audit if not found
    const templateName = templateMap[formData.template] || 'Energy Audit (Industry).docx';

    // Convert date from YYYY-MM-DD to "10th October 2025" format
    const convertDateToWords = (dateString) => {
      if (!dateString) return '';
      
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
    };

    // Transform frontend data to backend format
    // For IGBC Existing Building, calculate total cost from registration + certification + consultancy
    let costValue = formData.cost || '0';
    
    // Helper function to format with Indian commas
    const formatIndianCommas = (num) => {
      const numStr = num.toString();
      const lastThree = numStr.substring(numStr.length - 3);
      const otherNumbers = numStr.substring(0, numStr.length - 3);
      if (otherNumbers !== '') {
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
      }
      return lastThree;
    };

    // Helper function to parse amount
    const parseAmount = (value) => {
      if (!value) return 0;
      return parseInt(value.toString().replace(/,/g, ''), 10) || 0;
    };

    const payload = {
      template_name: templateName,                             // Dynamic template name based on selection
      for_whom_proposal_is: String(formData.clientName || ''), // Maps clientName → for_whom_proposal_is  
      submitted_to: String(formData.submittedTo || ''),        // Direct mapping
      date: convertDateToWords(formData.date),                 // Date converted to "10th October 2025" format
      cost: String(costValue),                                 // Consultancy cost as string WITH Indian commas
      currency: String(formData.currency || 'INR'),            // Currency code with default
      project_overview: String(formData.projectDescription || ''), // Maps projectDescription → project_overview (validated above)
      extra_points: (formData.termsAndConditions || []).map(term => String(term)), // Terms array as strings
      payment_items: paymentSchedule.map(item => ({
        title: String(item.title || '').trim(),               // Payment milestone title (trimmed)
        percent: parseFloat(item.percent || 0)                // As float for backend validation
      })),
      custom_fields: {}                                        // Empty object for future use
    };

    // Add IGBC Existing Building specific fields
    if (formData.template === 'igbc-existing-building') {
      const registrationFee = parseAmount(formData.registrationCost);
      const certificationFee = parseAmount(formData.certificationCost);
      // Total IGBC fees = Registration + Certification only (NOT including consultancy cost)
      const totalIGBCFees = registrationFee + certificationFee;
      
      payload.registration_cost = String(formData.registrationCost || '0');
      payload.certification_cost = String(formData.certificationCost || '0');
      payload.total_cost = formatIndianCommas(totalIGBCFees);
      payload.s_currency = String(formData.currency || 'INR');
    }

    // Add IGBC Green Interiors council fees
    if (formData.template === 'igbc-green-interiors') {
      const registrationFee = parseAmount(formData.registrationCost);
      const certificationFee = parseAmount(formData.certificationCost);
      const totalCouncilFees = registrationFee + certificationFee;
      
      payload.registration_cost = String(formData.registrationCost || '0');
      payload.certification_cost = String(formData.certificationCost || '0');
      payload.total_cost = formatIndianCommas(totalCouncilFees);
      payload.s_currency = String(formData.currency || 'INR');
    }

    // Add IGBC Green Services Building council fees
    if (formData.template === 'igbc-green-services-building') {
      const registrationFee = parseAmount(formData.registrationCost);
      const certificationFee = parseAmount(formData.certificationCost);
      const totalCouncilFees = registrationFee + certificationFee;
      
      payload.registration_cost = String(formData.registrationCost || '0');
      payload.certification_cost = String(formData.certificationCost || '0');
      payload.total_cost = formatIndianCommas(totalCouncilFees);
      payload.s_currency = String(formData.currency || 'INR');
    }

    // Add IGBC Green Factory specific fields
    if (formData.template === 'igbc-green-factory') {
      // Area field is required for IGBC Green Factory (in Sqm)
      const areaValue = formData.area ? String(formData.area).replace(/,/g, '') : '0';
      payload.area = areaValue; // Send area in Sqm
    }

    console.log('📋 Submitting form data:', formData);
    console.log('📤 Sending to backend:', payload);
    console.log('📄 Template selected:', templateName);
    console.log('🔗 API URL:', `${API_BASE_URL}/api/process-proposal`);
    console.log('📊 Validation passed - Words:', wordCount, 'Total %:', totalPercentage.toFixed(1));

    const response = await api.post('/api/process-proposal', payload);

    console.log('📋 Full backend response:', response);
    console.log('✅ Backend response data:', response.data);

    // Transform backend response to frontend format
    // Backend format: { success: true, message: "...", output_file: "filename.docx", download_url: "/api/download/..." }
    // Frontend expects: { filename: "filename.docx", status: "success", message: "..." }
    
    const backendData = response.data;
    let filename = null;
    
    // Extract filename from backend response (try multiple possible fields)
    if (backendData.output_file) {
      filename = backendData.output_file;
      console.log('✅ Found backend-generated filename (output_file):', filename);
    } else if (backendData.filename) {
      filename = backendData.filename;
      console.log('✅ Found backend-generated filename (filename):', filename);
    } else {
      console.warn('⚠️ No filename found in backend response');
    }
    
    // Create standardized response for frontend
    const transformedResponse = {
      filename: filename,
      status: backendData.success ? 'success' : 'error',
      message: backendData.message || 'Proposal generated successfully'
    };
    
    console.log('✅ Final filename set to state:', filename);
    console.log('📋 Transformed response for frontend:', transformedResponse);

    return {
      success: true,
      data: transformedResponse
    };

  } catch (error) {
    console.error('❌ API Error:', error);

    let errorMessage = 'Failed to generate proposal';

    if (error.response) {
      // Server responded with error status
      console.error('📋 Response status:', error.response.status);
      console.error('📋 Response data:', error.response.data);
      
      if (error.response.status === 422) {
        // Validation error - Enhanced handling for local backend
        const errorData = error.response.data;
        
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // FastAPI validation errors (list format)
            errorMessage = errorData.detail.map(err => {
              const field = err.loc ? err.loc.join('.') : 'unknown field';
              return `${field}: ${err.msg}`;
            }).join('\n');
          } else if (typeof errorData.detail === 'object' && errorData.detail.message) {
            // Custom validation error with message
            errorMessage = errorData.detail.message;
          } else if (typeof errorData.detail === 'string') {
            // Simple string error
            errorMessage = errorData.detail;
          } else {
            errorMessage = 'Validation failed - please check your input';
          }
        } else {
          errorMessage = 'Validation error - please check your input data';
        }
        
        console.error('📋 422 Validation Error Details:', errorMessage);
      } else if (error.response.status === 500) {
        errorMessage = 'Server error occurred while generating proposal';
      } else if (error.response.status === 408) {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.response.status === 404) {
        errorMessage = 'API endpoint not found. Please check your backend server.';
      } else {
        errorMessage = error.response.data?.detail || 
                      error.response.data?.message || 
                      `Server returned error ${error.response.status}`;
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response:', error.request);
      errorMessage = 'No response from server. Please check your connection and backend server.';
    } else {
      // Error setting up the request
      console.error('Request setup error:', error.message);
      errorMessage = error.message || 'Failed to generate proposal';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Download generated proposal
 * @param {string} filename - Name of the file to download
 * @returns {Promise<Blob>} File blob for download
 */
export const downloadProposal = async (filename) => {
  try {
    console.log('📥 Starting download process...');
    console.log('📂 Filename:', filename);
    console.log('🔗 API Base URL:', API_BASE_URL);
    console.log('🎯 Full download URL:', `${API_BASE_URL}/api/download/${filename}`);

    const response = await axios.get(
      `${API_BASE_URL}/api/download/${filename}`,
      {
        responseType: 'blob',
        timeout: 120000, // 120 seconds for download
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, application/octet-stream, */*',
        }
      }
    );

    console.log('✅ File downloaded successfully!');
    console.log('📊 Response status:', response.status);
    console.log('📦 File size:', response.data.size, 'bytes');
    console.log('📄 Content type:', response.headers['content-type']);
    console.log('📋 All response headers:', response.headers);

    return {
      success: true,
      data: response.data,
      filename: filename,
      contentType: response.headers['content-type']
    };

  } catch (error) {
    console.error('❌ Download Error Details:', error);
    console.error('📍 Error message:', error.message);
    console.error('🔍 Error config:', error.config);
    
    let errorMessage = 'Failed to download proposal';

    if (error.response) {
      // Server responded with error status
      console.error('🚨 Server Error Response:');
      console.error('📊 Status:', error.response.status);
      console.error('📝 Status Text:', error.response.statusText);
      console.error('📋 Headers:', error.response.headers);
      console.error('📄 Data:', error.response.data);
      
      if (error.response.status === 404) {
        errorMessage = `File not found: ${filename}. Please generate the proposal again.`;
      } else if (error.response.status === 500) {
        errorMessage = 'Server error occurred while downloading. Please try again.';
      } else {
        errorMessage = error.response.data?.detail || 
                      error.response.data?.message || 
                      `Download failed with status ${error.response.status}`;
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('🌐 Network Error - No response received');
      console.error('📡 Request details:', error.request);
      errorMessage = `No response from server. Check if ${API_BASE_URL} is accessible.`;
    } else {
      // Error setting up the request
      console.error('⚙️ Request Setup Error');
      errorMessage = error.message || 'Failed to setup download request';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Validate form data before submission
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
export const validateFormData = (formData) => {
  const errors = [];

  // Required field validation
  if (!formData.clientName || formData.clientName.trim() === '') {
    errors.push('Client Name is required');
  }

  if (!formData.submittedTo || formData.submittedTo.trim() === '') {
    errors.push('Contact Person is required');
  }

  if (!formData.date) {
    errors.push('Date is required');
  }

  if (!formData.cost || parseFloat(String(formData.cost).replace(/,/g, '')) <= 0) {
    errors.push('Cost must be a positive number');
  }

  if (!formData.currency) {
    errors.push('Currency is required');
  }

  // Validate currency is in allowed list
  const allowedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY'];
  if (formData.currency && !allowedCurrencies.includes(formData.currency)) {
    errors.push(`Currency must be one of: ${allowedCurrencies.join(', ')}`);
  }

  if (!formData.projectDescription || formData.projectDescription.trim() === '') {
    errors.push('Project Description is required');
  }

  // Validate project description word count (max 100 words)
  if (formData.projectDescription) {
    const wordCount = formData.projectDescription.trim().split(/\s+/).length;
    if (wordCount > 100) {
      errors.push(`Project Description must be maximum 100 words (current: ${wordCount} words)`);
    }
  }

  // Validate area for IGBC Green Factory
  if (formData.template === 'igbc-green-factory') {
    if (!formData.area || parseFloat(String(formData.area).replace(/,/g, '')) <= 0) {
      errors.push('Area (in Sqm) is required for IGBC Green Factory');
    }
  }

  // Validate payment schedule
  if (!formData.paymentSchedule || formData.paymentSchedule.length === 0) {
    errors.push('At least one payment milestone is required');
  } else {
    // Check if all milestones have titles
    const emptyMilestones = formData.paymentSchedule.filter(item => 
      !item.title || item.title.trim() === ''
    );
    if (emptyMilestones.length > 0) {
      errors.push('All payment milestones must have a title');
    }

    // Check if all percentages are valid (0-100) - convert to number for validation
    const invalidPercentages = formData.paymentSchedule.filter(item => {
      const percent = parseFloat(item.percent || 0);
      return percent < 0 || percent > 100;
    });
    if (invalidPercentages.length > 0) {
      errors.push('All payment percentages must be between 0 and 100');
    }

    // Check if total equals 100%
    const totalPercentage = formData.paymentSchedule.reduce((sum, item) => 
      sum + (parseFloat(item.percent) || 0), 0
    );
    if (Math.abs(totalPercentage - 100) > 0.01) {
      errors.push(`Payment schedule must total 100% (current: ${totalPercentage.toFixed(1)}%)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Test download endpoint connectivity
 * @param {string} filename - Name of the file to test
 * @returns {Promise<Object>} Test result
 */
export const testDownloadEndpoint = async (filename) => {
  try {
    console.log('🧪 Testing download endpoint...');
    console.log('🎯 Testing URL:', `${API_BASE_URL}/api/download/${filename}`);
    
    // Try a GET request with a small range to test endpoint without downloading full file
    const testResponse = await axios.get(`${API_BASE_URL}/api/download/${filename}`, {
      timeout: 10000,
      headers: {
        'Range': 'bytes=0-1023'  // Only request first 1KB to test endpoint
      },
      responseType: 'blob',
      validateStatus: function (status) {
        // Accept 200 (OK), 206 (Partial Content), or 416 (Range Not Satisfiable)
        return status === 200 || status === 206 || status === 416;
      }
    });
    
    console.log('✅ GET request successful:', testResponse.status);
    console.log('📋 Headers:', testResponse.headers);
    console.log('📄 Content-Type:', testResponse.headers['content-type']);
    
    return {
      success: true,
      message: `Download endpoint is accessible (${testResponse.status})`,
      status: testResponse.status,
      headers: testResponse.headers,
      contentType: testResponse.headers['content-type']
    };
    
  } catch (error) {
    console.error('❌ Download endpoint test failed:', error);
    
    let message = 'Download endpoint test failed';
    if (error.response) {
      message = `Endpoint returned ${error.response.status}: ${error.response.statusText}`;
      console.error('📋 Error response headers:', error.response.headers);
    } else if (error.request) {
      message = 'Cannot reach download endpoint - network error';
    } else {
      message = error.message;
    }
    
    return {
      success: false,
      message: message,
      error: error.message,
      status: error.response?.status
    };
  }
};

/**
 * Debug function to inspect backend response structure
 * @param {Object} formData - Form data to test with
 * @returns {Promise<Object>} Response analysis
 */
export const debugBackendResponse = async (formData) => {
  try {
    console.log('🔍 Debug: Testing backend response structure...');
    console.log('🔍 Local backend expects output_file field, not filename');
    console.log('🔍 Expected pattern: Energy_Audit_ABC_Manufacturing_Ltd._20241008_143022.docx');
    
  // Create a test payload for project_overview (subject to max 100 words validation)
  const testProjectOverview = "This comprehensive energy audit project focuses on detailed assessment of manufacturing facility energy consumption patterns, equipment efficiency evaluation, power quality analysis, identification of energy saving opportunities across production lines, HVAC systems optimization, lighting infrastructure assessment, and compressed air systems evaluation to optimize operational costs and environmental sustainability.";
    
  // Validate word count
  const words = testProjectOverview.split(/\s+/).filter(word => word.trim().length > 0);
  console.log('🔍 Test project overview word count:', words.length);
    
    const testPayload = {
      template_name: "Energy Audit (Industry).docx",
      for_whom_proposal_is: formData?.clientName || "Test Client Manufacturing Ltd",
      submitted_to: formData?.submittedTo || "Test Contact Person",
      date: formData?.date || "2025-10-08",
      cost: "75000",
      currency: "USD", 
      project_overview: testProjectOverview, // 50+ words as required
      extra_points: [
        "Detailed energy consumption baseline establishment",
        "Equipment efficiency benchmarking and gap analysis", 
        "Power factor improvement recommendations"
      ],
      payment_items: [
        { title: "Initial Assessment", percent: 30.0 },
        { title: "Data Collection", percent: 40.0 },
        { title: "Analysis & Report", percent: 20.0 },
        { title: "Final Delivery", percent: 10.0 }
      ],
      custom_fields: {}
    };
    
    console.log('🔍 Sending test payload:', testPayload);
    console.log('🔍 Word count validation:', words.length, 'words (50-100 required)');
    
    const response = await api.post('/api/process-proposal', testPayload);

    console.log('🔍 Raw axios response:', response);
    console.log('🔍 Response data type:', typeof response.data);
    console.log('🔍 Response data keys:', Object.keys(response.data || {}));
    console.log('🔍 Response data content:', JSON.stringify(response.data, null, 2));
    
    // Extract filename from response (check both possible fields)
    const backendFilename = response.data?.output_file || response.data?.filename;
    
    // Check for expected filename patterns (both local and production)
    const localPattern = /Energy_Audit_.*_\d{8}_\d{6}\.docx/;  // Local backend format
    const prodPattern = /Energy Audit \(Industry\)_.*_\d{8}_\d{6}\.docx/; // Production format
    
    const matchesLocalPattern = localPattern.test(backendFilename || '');
    const matchesProdPattern = prodPattern.test(backendFilename || '');
    
    return {
      success: true,
      analysis: {
        responseType: typeof response.data,
        keys: Object.keys(response.data || {}),
        data: response.data,
        filename: backendFilename,
        hasValidLocalFilename: matchesLocalPattern,
        hasValidProdFilename: matchesProdPattern,
        localPattern: 'Energy_Audit_{ClientName}_{YYYYMMDD}_{HHMMSS}.docx',
        prodPattern: 'Energy Audit (Industry)_{ClientName}_{YYYYMMDD}_{HHMMSS}.docx',
        actualFilename: backendFilename || 'NOT FOUND',
        wordCount: words.length,
        // No lower limit enforced; only max 100 words is validated elsewhere
        wordCountValid: words.length <= 100
      }
    };

  } catch (error) {
    console.error('🔍 Debug error:', error);
    
    // Enhanced error details for debugging
    let errorDetails = {
      success: false,
      error: error.message
    };
    
    if (error.response) {
      errorDetails.status = error.response.status;
      errorDetails.statusText = error.response.statusText;
      errorDetails.responseData = error.response.data;
      
      if (error.response.status === 422) {
        console.error('🔍 422 Validation Error - Check payload structure and word count');
      }
    }
    
    return errorDetails;
  }
};

// Export as named exports
const proposalService = {
  generateProposal,
  downloadProposal,
  validateFormData,
  testDownloadEndpoint,
  debugBackendResponse
};

export default proposalService;
