import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ssoHandshake } from './authService';

const SSOCallback = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSSOAuthentication = async () => {
      try {
        // Extract encrypted token from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const encryptedToken = urlParams.get('code');

        console.log('🔐 SSO Handshake initiated');
        console.log('📍 Current URL:', window.location.href);

        if (!encryptedToken) {
          throw new Error('No authentication code provided in URL. Please use the correct SSO link.');
        }

        console.log('🔑 Token received (length):', encryptedToken.length);
        setStatus('authenticating');

        // Call backend handshake endpoint
        const result = await ssoHandshake(encryptedToken);

        if (result.success) {
          console.log('✅ SSO authentication successful');
          console.log('👤 User authenticated:', result.user);

          setUserInfo(result.user);
          setStatus('success');

          // Redirect to main application after brief success display
          setTimeout(() => {
            console.log('🔄 Redirecting to application...');
            navigate('/', { replace: true });
          }, 1500);
        } else {
          throw new Error(result.message || 'Authentication failed. Please try again.');
        }

      } catch (err) {
        console.error('❌ SSO handshake failed:', err);
        setStatus('error');
        
        let errorMessage = 'Authentication failed';
        
        if (err.response) {
          // Backend returned an error
          const status = err.response.status;
          const data = err.response.data;
          
          if (status === 401) {
            errorMessage = 'Invalid or expired authentication token';
          } else if (status === 422) {
            errorMessage = data?.detail || 'Invalid token format';
          } else if (status === 429) {
            errorMessage = 'Too many authentication attempts. Please try again later.';
          } else {
            errorMessage = data?.detail || data?.message || 'Server error occurred';
          }
        } else if (err.request) {
          errorMessage = 'Cannot reach authentication server. Please check your connection.';
        } else {
          errorMessage = err.message || 'Authentication failed';
        }
        
        setError(errorMessage);

        // Redirect to login after showing error
        setTimeout(() => {
          console.log('🔄 Redirecting to login...');
          navigate('/', { replace: true });
        }, 4000);
      }
    };

    handleSSOAuthentication();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'processing' && (
          <div style={styles.content}>
            <div style={styles.spinner}></div>
            <h2 style={styles.heading}>🔄 Processing SSO Request</h2>
            <p style={styles.text}>Validating authentication token...</p>
          </div>
        )}

        {status === 'authenticating' && (
          <div style={styles.content}>
            <div style={styles.spinner}></div>
            <h2 style={styles.heading}>🔐 Authenticating</h2>
            <p style={styles.text}>Verifying your credentials with the server...</p>
            <p style={styles.subtext}>This should only take a moment</p>
          </div>
        )}

        {status === 'success' && (
          <div style={styles.content}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successHeading}>Authentication Successful!</h2>
            <p style={styles.text}>Welcome back{userInfo?.name ? `, ${userInfo.name}` : ''}!</p>
            <p style={styles.subtext}>Redirecting to your dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div style={styles.content}>
            <div style={styles.errorIcon}>❌</div>
            <h2 style={styles.errorHeading}>Authentication Failed</h2>
            <p style={styles.errorText}>{error}</p>
            <p style={styles.subtext}>Redirecting to login page...</p>
          </div>
        )}
      </div>

      {/* Development Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={styles.debugPanel}>
          <strong>🔧 Debug Info:</strong><br />
          Status: {status}<br />
          URL: {window.location.href}<br />
          Code Param: {new URLSearchParams(window.location.search).get('code')?.substring(0, 50)}...
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '60px 80px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
    animation: 'slideUp 0.6s ease-out'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '6px solid #f3f3f3',
    borderTop: '6px solid #2ECC71',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  successIcon: {
    fontSize: '80px',
    animation: 'scaleIn 0.5s ease-out'
  },
  errorIcon: {
    fontSize: '80px',
    animation: 'shake 0.5s ease-out'
  },
  heading: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#27AE60',
    margin: '0'
  },
  successHeading: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#27AE60',
    margin: '0'
  },
  errorHeading: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#e74c3c',
    margin: '0'
  },
  text: {
    fontSize: '1.1rem',
    color: '#555',
    margin: '0',
    fontWeight: '500'
  },
  subtext: {
    fontSize: '0.95rem',
    color: '#888',
    margin: '0',
    fontStyle: 'italic'
  },
  errorText: {
    fontSize: '1rem',
    color: '#e74c3c',
    margin: '0',
    fontWeight: '600',
    padding: '15px 20px',
    background: 'rgba(231, 76, 60, 0.1)',
    borderRadius: '10px',
    border: '2px solid rgba(231, 76, 60, 0.3)'
  },
  debugPanel: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontFamily: 'monospace',
    maxWidth: '400px',
    wordBreak: 'break-all',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  }
};

// Inject animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(styleSheet);

export default SSOCallback;
