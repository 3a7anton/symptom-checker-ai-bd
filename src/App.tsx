import { Suspense, lazy } from 'react'
import './App.css'
import useLenis from './hooks/useLenis'
import { useAppRouter } from './hooks/useAppRouter'

// Lazy load components for better performance
const LandingPage = lazy(() => import('./components/LandingPage'))
const AuthComponent = lazy(() => import('./components/AuthComponent'))
const SymptomChecker = lazy(() => import('./components/SymptomChecker'))

function App() {
  // Initialize smooth scrolling
  useLenis();
  
  // App routing and state management
  const { 
    currentView, 
    demoUsesLeft,
    navigateTo, 
    useDemoAnalysis 
  } = useAppRouter();

  // Render based on current view
  const renderCurrentView = () => {
    const LoadingSpinner = () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        <div>🔄 Loading...</div>
      </div>
    );

    switch (currentView) {
      case 'landing':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LandingPage 
              onGetStarted={() => navigateTo('auth')}
              onTryDemo={() => navigateTo('demo')}
            />
          </Suspense>
        );
      
      case 'auth':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AuthComponent
              onBack={() => navigateTo('landing')}
              onAuthSuccess={() => navigateTo('main')}
            />
          </Suspense>
        );
      
      case 'demo':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="demo-app">
              <div className="demo-header">
                <button 
                  onClick={() => navigateTo('landing')} 
                  className="back-btn"
                >
                  ← Back to Home
                </button>
                <div className="demo-info">
                  <h1>🎯 Demo Mode</h1>
                  <p>You have <strong>{demoUsesLeft}</strong> free analyses remaining</p>
                  {demoUsesLeft === 0 && (
                    <div className="demo-expired">
                      <p>Demo uses exhausted. Sign up for unlimited access!</p>
                      <button 
                        onClick={() => navigateTo('auth')} 
                        className="signup-prompt-btn"
                      >
                        🔐 Sign Up Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <SymptomChecker 
                isDemoMode={true} 
                demoUsesLeft={demoUsesLeft}
                onDemoUse={useDemoAnalysis}
                onSignUpPrompt={() => navigateTo('auth')}
              />
            </div>
          </Suspense>
        );
      
      case 'main':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="main-app">
              <div className="main-header">
                <h1>⚕️ AI Symptom Checker & Health Tracker</h1>
                <p>Your personal AI-powered health companion</p>
              </div>
              <SymptomChecker 
                isDemoMode={false}
                demoUsesLeft={0}
                onDemoUse={() => true}
                onSignUpPrompt={() => {}}
              />
            </div>
          </Suspense>
        );
      
      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LandingPage 
              onGetStarted={() => navigateTo('auth')}
              onTryDemo={() => navigateTo('demo')}
            />
          </Suspense>
        );
    }
  };

  return (
    <div className="app">
      {renderCurrentView()}
    </div>
  );
}

export default App;
