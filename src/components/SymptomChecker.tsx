import { useState, useRef, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { useFadeIn, useSlideInLeft, useSlideInRight, useStaggerAnimation } from '../hooks/useGSAP';
import { useOpenAI } from '../hooks/useOpenAI';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import ChatHistoryService from '../services/chatHistoryService';
import type { Symptom } from '../services/openaiService';
import './SymptomChecker.css';

// Lazy load user-specific components
const UserProfile = lazy(() => import('./UserProfile'));
const ChatHistory = lazy(() => import('./ChatHistory'));

interface SymptomCheckerProps {
  isDemoMode?: boolean;
  demoUsesLeft?: number;
  onDemoUse?: () => boolean;
  onSignUpPrompt?: () => void;
}

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ 
  isDemoMode = false, 
  demoUsesLeft = 0, 
  onDemoUse = () => true, 
  onSignUpPrompt = () => {} 
}) => {
  const [user] = useAuthState(auth);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [showChatHistory, setShowChatHistory] = useState(false);

  // Chat history service
  const chatHistoryService = ChatHistoryService.getInstance();

  // OpenAI integration
  const { 
    isLoading, 
    error, 
    analysisResult, 
    healthTips, 
    analyzeSymptoms: analyzeWithAI, 
    generateHealthTips, 
    clearResults 
  } = useOpenAI();

  // Animation refs
  const titleRef = useFadeIn(1.2, 0.2);
  const formRef = useSlideInLeft(1, 0.4);
  const symptomsRef = useSlideInRight(1, 0.6);
  const staggerRef = useStaggerAnimation();
  const resultsRef = useRef<HTMLDivElement>(null);

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Sore throat', 'Fatigue',
    'Nausea', 'Dizziness', 'Chest pain', 'Shortness of breath',
    'Stomach pain', 'Joint pain', 'Muscle aches'
  ];

  const addSymptom = () => {
    if (currentSymptom.trim()) {
      const newSymptom: Symptom = {
        id: Date.now().toString(),
        name: currentSymptom,
        severity,
        duration: duration || undefined,
        description: description || undefined,
      };

      setSymptoms([...symptoms, newSymptom]);
      setCurrentSymptom('');
      setDuration('');
      setDescription('');

      // Animate the new symptom
      setTimeout(() => {
        const newElement = document.querySelector('.symptom-item:last-child');
        if (newElement) {
          gsap.fromTo(
            newElement,
            { opacity: 0, scale: 0.8, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
          );
        }
      }, 50);
    }
  };

  const removeSymptom = (id: string) => {
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
      gsap.to(element, {
        opacity: 0,
        scale: 0.8,
        x: 50,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setSymptoms(symptoms.filter(s => s.id !== id));
        }
      });
    }
  };

  const handleAnalyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      return;
    }

    // Check demo mode restrictions
    if (isDemoMode) {
      if (demoUsesLeft === 0) {
        onSignUpPrompt();
        return;
      }
      
      const canUse = onDemoUse();
      if (!canUse) {
        onSignUpPrompt();
        return;
      }
    }

    clearResults();
    const result = await analyzeWithAI(symptoms);

    // Save to chat history if user is logged in and not in demo mode
    if (user && !isDemoMode && result) {
      try {
        await chatHistoryService.saveChatSession(user.uid, symptoms, result);
        console.log('Chat session saved successfully');
      } catch (error) {
        console.warn('Failed to save chat session:', error);
      }
    }

    // Animate results
    if (resultsRef.current) {
      gsap.fromTo(
        resultsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  };

  const loadFromHistory = (historicalSymptoms: Symptom[]) => {
    setSymptoms(historicalSymptoms);
    clearResults();
    setShowChatHistory(false);
    
    // Scroll to top smoothly
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: 0 },
      ease: 'power2.out'
    });
  };

  const quickAddSymptom = (symptomName: string) => {
    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: symptomName,
      severity: 'mild'
    };

    setSymptoms([...symptoms, newSymptom]);

    // Animate the new symptom
    setTimeout(() => {
      const newElement = document.querySelector('.symptom-item:last-child');
      if (newElement) {
        gsap.fromTo(
          newElement,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
      }
    }, 50);
  };

  return (
    <div className="symptom-checker">
      {/* User Profile - only show for logged-in users */}
      {user && !isDemoMode && (
        <Suspense fallback={<div className="user-profile-loading">Loading profile...</div>}>
          <UserProfile 
            onChatHistoryToggle={() => setShowChatHistory(!showChatHistory)}
            showChatHistory={showChatHistory}
          />
        </Suspense>
      )}

      {/* Chat History - only show for logged-in users when toggled */}
      {user && !isDemoMode && showChatHistory && (
        <Suspense fallback={<div className="chat-history-loading">Loading chat history...</div>}>
          <ChatHistory onLoadSession={loadFromHistory} />
        </Suspense>
      )}

      <div ref={titleRef} className="checker-header">
        <h2>🏥 AI Symptom Checker</h2>
        <p>Enter your symptoms to get AI-powered health insights</p>
        {isDemoMode && (
          <div className="demo-banner">
            <p>🎯 Demo Mode - {demoUsesLeft} free analyses remaining</p>
          </div>
        )}
      </div>

      <div className="checker-content">
        <div ref={formRef} className="input-section">
          <div className="symptom-input">
            <input
              type="text"
              value={currentSymptom}
              onChange={(e) => setCurrentSymptom(e.target.value)}
              placeholder="Enter a symptom..."
              onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
            />
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as 'mild' | 'moderate' | 'severe')}
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
            <button onClick={addSymptom} className="add-btn">Add</button>
          </div>

          <div ref={staggerRef} className="quick-symptoms">
            <h4>Quick Add Common Symptoms:</h4>
            <div className="symptom-tags">
              {commonSymptoms.map((symptom, index) => (
                <button
                  key={index}
                  onClick={() => quickAddSymptom(symptom)}
                  className="symptom-tag"
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={symptomsRef} className="symptoms-section">
          <h3>Your Symptoms ({symptoms.length})</h3>
          <div className="symptoms-list">
            {symptoms.map((symptom) => (
              <div
                key={symptom.id}
                data-id={symptom.id}
                className={`symptom-item severity-${symptom.severity}`}
              >
                <span className="symptom-name">{symptom.name}</span>
                <span className="symptom-severity">{symptom.severity}</span>
                <button
                  onClick={() => removeSymptom(symptom.id)}
                  className="remove-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAnalyzeSymptoms}
            className={`analyze-btn ${isDemoMode && demoUsesLeft === 0 ? 'demo-expired' : ''}`}
            disabled={symptoms.length === 0 || isLoading}
          >
            {isLoading ? '🔄 Analyzing...' : 
             isDemoMode 
               ? demoUsesLeft === 0 
                 ? '🔐 Sign Up for Analysis' 
                 : `🎯 Demo Analysis (${demoUsesLeft} left)`
               : '🤖 AI Analysis'
            }
          </button>
        </div>
      </div>

      {error && (
        <div className="error-section">
          <h3>❌ Analysis Error</h3>
          <p className="error-text">{error}</p>
        </div>
      )}

      {analysisResult && (
        <div ref={resultsRef} className="results-section">
          <h3>🤖 AI Analysis Results</h3>
          
          <div className="analysis-summary">
            <h4>📋 Summary</h4>
            <p>{analysisResult.summary}</p>
          </div>

          <div className="urgency-level">
            <h4>🚨 Urgency Level</h4>
            <span className={`urgency-badge urgency-${analysisResult.urgencyLevel}`}>
              {analysisResult.urgencyLevel.toUpperCase()}
            </span>
          </div>

          <div className="possible-conditions">
            <h4>🔍 Possible Conditions</h4>
            <ul>
              {analysisResult.possibleConditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </div>

          <div className="recommendations">
            <h4>💡 Recommendations</h4>
            <ul>
              {analysisResult.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>

          {healthTips.length > 0 && (
            <div className="health-tips">
              <h4>🌟 Health Tips</h4>
              <ul>
                {healthTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="disclaimer">
            <p><strong>⚠️ Disclaimer:</strong> {analysisResult.disclaimer}</p>
          </div>

          {!isDemoMode && (
            <button
              onClick={() => generateHealthTips(analysisResult)}
              className="tips-btn"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Generating...' : '💡 Get Health Tips'}
            </button>
          )}

          {isDemoMode && demoUsesLeft === 0 && (
            <div className="signup-prompt">
              <p>Want more features like health tips and tracking?</p>
              <button onClick={onSignUpPrompt} className="signup-btn">
                🔐 Sign Up for Full Access
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
