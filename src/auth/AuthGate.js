import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import { checkSession, getPreseedKey, submitApiKey, sanitizeUrl } from './authService';

const AuthGate = ({ children }) => {
  const [authState, setAuthState] = useState({
    isChecking: true,
    isAuthenticated: false,
    isLoggingIn: false,
    error: null
  });

  useEffect(() => {
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initAuth = async () => {
    try {
      const hasSession = await checkSession();
      
      if (hasSession) {
        setAuthState({
          isChecking: false,
          isAuthenticated: true,
          isLoggingIn: false,
          error: null
        });
        return;
      }

      const preseedKey = getPreseedKey();

      if (preseedKey) {
        sanitizeUrl();
        await handleLogin(preseedKey, true);
      } else {
        setAuthState({
          isChecking: false,
          isAuthenticated: false,
          isLoggingIn: false,
          error: null
        });
      }
    } catch (error) {
      setAuthState({
        isChecking: false,
        isAuthenticated: false,
        isLoggingIn: false,
        error: 'Failed to initialize authentication'
      });
    }
  };

  const handleLogin = async (apiKey, isPreseed = false) => {
    setAuthState(prev => ({
      ...prev,
      isLoggingIn: true,
      error: null
    }));

    try {
      const result = await submitApiKey(apiKey);

      if (result.success) {
        const hasSession = await checkSession();

        if (hasSession) {
          setAuthState({
            isChecking: false,
            isAuthenticated: true,
            isLoggingIn: false,
            error: null
          });
        } else {
          setAuthState({
            isChecking: false,
            isAuthenticated: false,
            isLoggingIn: false,
            error: 'Session establishment failed. Please try again.'
          });
        }
      } else {
        setAuthState({
          isChecking: false,
          isAuthenticated: false,
          isLoggingIn: false,
          error: result.error || 'Authentication failed'
        });
      }
    } catch (error) {
      setAuthState({
        isChecking: false,
        isAuthenticated: false,
        isLoggingIn: false,
        error: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  if (authState.isChecking) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Checking authentication...</p>
      </div>
    );
  }

  if (authState.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <LoginForm
      onSubmit={(apiKey) => handleLogin(apiKey, false)}
      error={authState.error}
      isLoading={authState.isLoggingIn}
    />
  );
};

const styles = {
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
    color: '#2e7d32',
    position: 'relative',
    overflow: 'hidden'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(46, 125, 50, 0.2)',
    borderTop: '4px solid #2e7d32',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0,
    color: '#1b5e20'
  }
};

export default AuthGate;
