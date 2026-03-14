import React, { useState } from 'react';

const LoginForm = ({ onSubmit, error, isLoading }) => {
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminKey.trim()) {
      onSubmit(adminKey.trim());
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated Background Circles */}
      <div style={styles.circle1}></div>
      <div style={styles.circle2}></div>
      <div style={styles.circle3}></div>
      <div style={styles.circle4}></div>
      <div style={styles.circle5}></div>
      
      <div style={styles.card}>
        {/* Company Logo */}
        <div style={styles.logoContainer}>
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            style={styles.logo}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>

        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg 
              style={styles.icon}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h2 style={styles.title}>Proposal Generator</h2>
          <p style={styles.subtitle}>
            Please authenticate to access the system
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="admin_key" style={styles.label}>
              Admin Key
            </label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="admin_key"
                name="admin_key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter your admin key"
                required
                disabled={isLoading}
                style={{
                  ...styles.input,
                  ...(isLoading ? styles.inputDisabled : {})
                }}
                autoComplete="off"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                disabled={isLoading}
                aria-label={showPassword ? "Hide admin key" : "Show admin key"}
              >
                {showPassword ? (
                  // Eye Off Icon
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  // Eye Icon
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <svg 
                style={styles.errorIcon}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !adminKey.trim()}
            style={{
              ...styles.button,
              ...(isLoading || !adminKey.trim() ? styles.buttonDisabled : {})
            }}
            onMouseOver={(e) => {
              if (!isLoading && adminKey.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(46, 204, 113, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(46, 204, 113, 0.3)';
            }}
          >
            {isLoading ? (
              <>
                <span style={styles.spinner}></span>
                Authenticating...
              </>
            ) : (
              <>
                <svg 
                  style={styles.buttonIcon}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                  />
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <div style={styles.ssoContainer}>
          <p style={styles.ssoText}>
            Have an SSO authentication link? Access via:
          </p>
          <div style={styles.ssoUrl}>
            <code style={styles.codeText}>
              /auth/handshake?code=&lt;token&gt;
            </code>
          </div>
          <p style={styles.ssoHint}>
            📎 Use the SSO link provided by your administrator
          </p>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            🔒 Your admin key is never stored locally and is only used to establish a secure session.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 0 60px rgba(74, 144, 226, 0.3), 0 0 100px rgba(74, 144, 226, 0.15)',
    maxWidth: '500px',
    width: '100%',
    overflow: 'hidden',
    animation: 'fadeInUp 0.6s ease-out',
    position: 'relative',
    zIndex: 10,
    transition: 'all 0.3s ease'
  },
  logoContainer: {
    textAlign: 'center',
    padding: '30px 30px 20px',
    borderBottom: '2px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '120px'
  },
  logo: {
    maxWidth: '180px',
    maxHeight: '80px',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
    margin: '0 auto'
  },
  header: {
    padding: '30px 40px 20px',
    textAlign: 'center'
  },
  iconContainer: {
    width: '70px',
    height: '70px',
    background: 'linear-gradient(135deg, #4A90E2 0%, #2ECC71 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)'
  },
  icon: {
    width: '35px',
    height: '35px',
    color: 'white'
  },
  title: {
    margin: '0 0 10px',
    fontSize: '1.8rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #4A90E2 0%, #2ECC71 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.5'
  },
  form: {
    padding: '20px 40px 30px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#4A90E2'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    padding: '14px 50px 14px 14px',
    fontSize: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    background: '#fafafa'
  },
  inputDisabled: {
    background: '#f5f5f5',
    cursor: 'not-allowed',
    opacity: 0.7
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    transition: 'all 0.2s ease',
    borderRadius: '6px'
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'rgba(231, 76, 60, 0.1)',
    border: '2px solid rgba(231, 76, 60, 0.3)',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  errorIcon: {
    width: '20px',
    height: '20px',
    color: '#e74c3c',
    flexShrink: 0
  },
  errorText: {
    fontSize: '0.9rem',
    color: '#c0392b',
    fontWeight: '500',
    flex: 1
  },
  button: {
    width: '100%',
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #4A90E2 0%, #2ECC71 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)'
  },
  buttonDisabled: {
    background: '#95a5a6',
    cursor: 'not-allowed',
    opacity: 0.6,
    boxShadow: 'none'
  },
  buttonIcon: {
    width: '20px',
    height: '20px'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block'
  },
  footer: {
    padding: '20px 40px',
    background: '#f8f9fa',
    borderTop: '1px solid #e0e0e0'
  },
  footerText: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: '1.5'
  },
  // Animated Background Circles - Green shades
  circle1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.15) 0%, rgba(39, 174, 96, 0.15) 100%)',
    top: '-150px',
    left: '-150px',
    animation: 'float 20s ease-in-out infinite',
    zIndex: 1
  },
  circle2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.12) 0%, rgba(46, 204, 113, 0.12) 100%)',
    bottom: '-200px',
    right: '-200px',
    animation: 'float 25s ease-in-out infinite reverse',
    zIndex: 1
  },
  circle3: {
    position: 'absolute',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.18) 0%, rgba(39, 174, 96, 0.18) 100%)',
    top: '50%',
    right: '-125px',
    animation: 'float 18s ease-in-out infinite',
    zIndex: 1
  },
  circle4: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.14) 0%, rgba(46, 204, 113, 0.14) 100%)',
    bottom: '30%',
    left: '-100px',
    animation: 'float 22s ease-in-out infinite reverse',
    zIndex: 1
  },
  circle5: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.1) 100%)',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    animation: 'float 30s ease-in-out infinite',
    zIndex: 1
  },
  divider: {
    padding: '20px 40px 10px',
    position: 'relative',
    textAlign: 'center'
  },
  dividerText: {
    position: 'relative',
    display: 'inline-block',
    padding: '0 15px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#95a5a6',
    background: 'white',
    zIndex: 1
  },
  ssoContainer: {
    padding: '10px 40px 20px',
    textAlign: 'center'
  },
  ssoText: {
    margin: '0 0 10px 0',
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500'
  },
  ssoUrl: {
    background: '#f8f9fa',
    border: '2px dashed #d0d0d0',
    borderRadius: '8px',
    padding: '12px 16px',
    margin: '10px 0',
    overflow: 'auto'
  },
  codeText: {
    fontSize: '0.85rem',
    color: '#3498DB',
    fontFamily: 'Monaco, Consolas, monospace',
    fontWeight: '600'
  },
  ssoHint: {
    margin: '10px 0 0 0',
    fontSize: '0.85rem',
    color: '#7f8c8d',
    fontStyle: 'italic'
  }
};

export default LoginForm;
