import { useState } from 'react';
import { useFadeIn, useSlideInLeft, useSlideInRight } from '../hooks/useGSAP';
import { signUp, signIn, signInWithGoogle, signOut } from '../services/authService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import './AuthComponent.css';

interface AuthComponentProps {
  onBack: () => void;
  onAuthSuccess: () => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ onBack, onAuthSuccess }) => {
  const [user, loading] = useAuthState(auth);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Animation refs
  const containerRef = useFadeIn(1, 0.2);
  const formRef = useSlideInLeft(1, 0.4);
  const socialRef = useSlideInRight(1, 0.6);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!isLogin && password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    }
  };

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div ref={containerRef} className="auth-success">
        <div className="success-card">
          <h2>✅ Welcome Back!</h2>
          <div className="user-info">
            <img 
              src={user.photoURL || '/default-avatar.png'} 
              alt="Profile" 
              className="user-avatar"
            />
            <div className="user-details">
              <p className="user-name">{user.displayName || 'User'}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <div className="auth-actions">
            <button onClick={onAuthSuccess} className="continue-btn">
              Continue to App
            </button>
            <button onClick={handleSignOut} className="signout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="auth-container">
      <div className="auth-content">
        <button onClick={onBack} className="back-btn">
          ← Back to Home
        </button>

        <div className="auth-header">
          <h1>🔐 {isLogin ? 'Welcome Back' : 'Join Us'}</h1>
          <p>
            {isLogin 
              ? 'Sign in to access unlimited AI health analysis' 
              : 'Create your account for complete health tracking'
            }
          </p>
        </div>

        <div className="auth-forms">
          {/* Social Authentication */}
          <div ref={socialRef} className="social-auth">
            <button 
              onClick={handleGoogleAuth} 
              disabled={isLoading}
              className="google-btn"
            >
              {isLoading ? '⏳' : '🔍'} Continue with Google
            </button>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          {/* Email Authentication */}
          <div ref={formRef} className="email-auth">
            <form onSubmit={handleEmailAuth}>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              {error && (
                <div className="error-message">
                  ❌ {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="submit-btn"
              >
                {isLoading ? '⏳ Processing...' : (isLogin ? '🔓 Sign In' : '🎯 Create Account')}
              </button>
            </form>
          </div>

          {/* Toggle Auth Mode */}
          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="toggle-btn"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="auth-features">
          <h3>🌟 What you get with an account:</h3>
          <ul>
            <li>✅ Unlimited AI symptom analysis</li>
            <li>📊 Personal health tracking dashboard</li>
            <li>📈 Progress charts and insights</li>
            <li>⏰ Smart health reminders</li>
            <li>🔒 Secure, encrypted health data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
