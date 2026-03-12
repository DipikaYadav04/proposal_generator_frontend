import axios from 'axios';

// API Configuration - default to production backend unless overridden
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://proposalgeneratorbackend-production.up.railway.app/';
const SESSION_CHECK_PATH = process.env.REACT_APP_SESSION_CHECK_PATH || '/auth/session';
const LOGIN_PATH = process.env.REACT_APP_LOGIN_PATH || '/auth/login';
const LOGOUT_PATH = process.env.REACT_APP_LOGOUT_PATH || '/auth/logout';

export const initHttpClient = () => {
  axios.defaults.baseURL = API_BASE_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  try {
    // Visibility for debugging: which base URL the client is using
    // This will show in the browser console when the app initializes
    // (only a small debug statement; safe to leave in or remove later)
    // eslint-disable-next-line no-console
    console.log('\u2699\ufe0f authService - API_BASE_URL:', API_BASE_URL);
  } catch (e) {
    // ignore console errors
  }
};

export const checkSession = async () => {
  try {
    const response = await axios.get(SESSION_CHECK_PATH, {
      withCredentials: true
    });
    return response.data?.authenticated === true;
  } catch (error) {
    return false;
  }
};

/**
 * Lightweight connectivity check used for the login screen indicator.
 * Returns whether the auth server is reachable, without requiring a valid session.
 */
export const pingAuthServer = async () => {
  try {
    const response = await axios.get(SESSION_CHECK_PATH, {
      withCredentials: true,
      validateStatus: () => true
    });

    return {
      reachable: true,
      status: response.status
    };
  } catch (error) {
    return {
      reachable: false,
      error
    };
  }
};

export const getPreseedKey = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlKey = urlParams.get('api_key');
    
    if (urlKey) {
      sessionStorage.removeItem('preseed');
      return urlKey;
    }
    
    const storageKey = sessionStorage.getItem('preseed');
    if (storageKey) {
      sessionStorage.removeItem('preseed');
      return storageKey;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

export const submitApiKey = async (apiKey) => {
  try {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      return { success: false, error: 'Admin key is required' };
    }

    const response = await axios.post(
      LOGIN_PATH,
      {},
      {
        headers: { 'X-API-Key': apiKey.trim() },
        withCredentials: true
      }
    );

    if (response.status === 200 || response.status === 204) {
      return { success: true, data: response.data };
    }

    return { success: false, error: 'Unexpected response from server' };

  } catch (error) {
    let errorMessage = 'Login failed';
    
    if (error.response) {
      const status = error.response.status;
      if (status === 401) errorMessage = 'Invalid admin key';
      else if (status === 422) errorMessage = 'Admin key required';
      else if (status === 429) errorMessage = 'Too many attempts. Please try again later.';
      else errorMessage = error.response.data?.detail || error.response.data?.message || 'Authentication failed';
    } else if (error.request) {
      errorMessage = 'Cannot reach authentication server. Please check your connection.';
    }

    return { success: false, error: errorMessage };
  }
};

export const clearSession = async () => {
  try {
    await axios.post(LOGOUT_PATH, {}, { withCredentials: true });
    sessionStorage.clear();
    window.location.reload();
  } catch (error) {
    sessionStorage.clear();
    window.location.reload();
  }
};

export const sanitizeUrl = () => {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('api_key')) {
      url.searchParams.delete('api_key');
      window.history.replaceState({}, document.title, url.toString());
    }
  } catch (error) {
    // Silent fail
  }
};

/**
 * SSO Handshake - Authenticate user with encrypted token
 * @param {string} encryptedToken - Encrypted token from SSO provider
 * @returns {Promise<Object>} Authentication result with user info
 */
export const ssoHandshake = async (encryptedToken) => {
  try {
    console.log('🔐 Initiating SSO handshake...');
    console.log('🔗 Backend URL:', API_BASE_URL);
    console.log('🔑 Token length:', encryptedToken?.length || 0);

    if (!encryptedToken || typeof encryptedToken !== 'string' || encryptedToken.trim() === '') {
      return { 
        success: false, 
        error: 'Invalid authentication token provided' 
      };
    }

    const response = await axios.get(
      `${API_BASE_URL}${SESSION_CHECK_PATH.replace('/session', '/handshake')}`,
      {
        params: { code: encryptedToken.trim() },
        withCredentials: true, // CRITICAL: Required for session cookie
        timeout: 30000 // 30 second timeout
      }
    );

    console.log('✅ Backend response received:', response.status);
    console.log('📦 Response data:', response.data);

    if (response.status === 200 && response.data) {
      // Store user info if provided
      if (response.data.user) {
        try {
          localStorage.setItem('sso_user', JSON.stringify(response.data.user));
          console.log('💾 User info stored in localStorage');
        } catch (e) {
          console.warn('⚠️ Could not store user info:', e);
        }
      }

      return {
        success: true,
        user: response.data.user || null,
        message: response.data.message || 'Authentication successful'
      };
    }

    return { 
      success: false, 
      error: 'Unexpected response format from server' 
    };

  } catch (error) {
    console.error('❌ SSO handshake error:', error);

    let errorMessage = 'SSO authentication failed';

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      console.error('📊 Error status:', status);
      console.error('📋 Error data:', data);

      if (status === 401) {
        errorMessage = 'Invalid or expired authentication token';
      } else if (status === 422) {
        errorMessage = data?.detail || 'Invalid token format';
      } else if (status === 429) {
        errorMessage = 'Too many authentication attempts. Please try again later.';
      } else if (status === 404) {
        errorMessage = 'SSO endpoint not found. Please check backend configuration.';
      } else {
        errorMessage = data?.detail || data?.message || `Server error (${status})`;
      }
    } else if (error.request) {
      console.error('🌐 No response received from server');
      errorMessage = 'Cannot reach authentication server. Please check your connection.';
    } else {
      console.error('⚙️ Request setup error:', error.message);
      errorMessage = error.message || 'Failed to initiate authentication';
    }

    return { 
      success: false, 
      error: errorMessage,
      response: error.response 
    };
  }
};

initHttpClient();

const authService = {
  initHttpClient,
  checkSession,
  pingAuthServer,
  getPreseedKey,
  submitApiKey,
  clearSession,
  sanitizeUrl,
  ssoHandshake
};

export default authService;
