import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useFadeIn, useSlideInLeft, useSlideInRight, useStaggerAnimation } from '../hooks/useGSAP';
import './LandingPage.css';

interface LandingPageProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onTryDemo }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);

  // Animation refs
  const heroRef = useFadeIn(1.2, 0.2);
  const featuresRef = useStaggerAnimation();
  const ctaRef = useSlideInLeft(1, 0.8);
  const demoRef = useSlideInRight(1, 1);

  // Color slideshow for background
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % colors.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [colors.length]);

  useEffect(() => {
    if (slideRef.current) {
      gsap.to(slideRef.current, {
        background: colors[currentSlide],
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  }, [currentSlide, colors]);

  return (
    <div ref={slideRef} className="landing-page">
      <div className="landing-content">
        {/* Hero Section */}
        <section ref={heroRef} className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              ⚕️ AI Symptom Checker & Health Tracker
            </h1>
            <p className="hero-subtitle">
              Stop panic-inducing Google searches. Get AI-powered health insights and track your wellness journey with confidence.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">🤖</span>
                <span className="stat-label">AI-Powered Analysis</span>
              </div>
              <div className="stat">
                <span className="stat-number">📊</span>
                <span className="stat-label">Health Tracking</span>
              </div>
              <div className="stat">
                <span className="stat-number">🔒</span>
                <span className="stat-label">Secure & Private</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">🌟 Comprehensive Health Management</h2>
          <div ref={featuresRef} className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Symptom Analysis</h3>
              <p>Get intelligent insights about your symptoms using advanced AI technology. No more misleading web searches.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Daily Health Log</h3>
              <p>Track symptoms, mood, and health notes daily. Build a comprehensive picture of your wellness journey.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracker</h3>
              <p>Visualize your health trends with charts and timelines. Identify patterns and improvements over time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚨</div>
              <h3>Emergency Alerts</h3>
              <p>Automatic suggestions to seek professional help when symptoms indicate serious conditions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍎</div>
              <h3>Lifestyle Suggestions</h3>
              <p>Personalized recommendations for diet, sleep, exercise, and hydration based on your health data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Smart Reminders</h3>
              <p>Never forget to log your daily health status with intelligent reminder system.</p>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="demo-section">
          <div className="demo-content">
            <div ref={demoRef} className="demo-card">
              <h3>🎯 Try Before You Sign Up</h3>
              <p className="demo-description">
                Experience our AI-powered symptom checker with <strong>2 free analyses</strong> - no registration required!
              </p>
              <div className="demo-features">
                <div className="demo-feature">✨ Instant AI Analysis</div>
                <div className="demo-feature">🔍 Symptom Insights</div>
                <div className="demo-feature">💡 Health Recommendations</div>
              </div>
              <button onClick={onTryDemo} className="demo-btn">
                🚀 Try Demo (2 Free Uses)
              </button>
              <p className="demo-note">
                After demo, sign up for unlimited access to all features including health tracking, progress charts, and personalized insights.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div ref={ctaRef} className="cta-content">
            <h2>Ready to Take Control of Your Health?</h2>
            <p>Join thousands who trust our AI-powered health insights</p>
            <div className="cta-buttons">
              <button onClick={onGetStarted} className="primary-btn">
                🔐 Sign Up for Full Access
              </button>
              <button onClick={onTryDemo} className="secondary-btn">
                🎯 Try Demo First
              </button>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="disclaimer-section">
          <div className="disclaimer-content">
            <h4>⚠️ Important Medical Disclaimer</h4>
            <p>
              This AI tool provides general health insights and is not a substitute for professional medical advice, 
              diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns. 
              In case of medical emergencies, contact emergency services immediately.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
