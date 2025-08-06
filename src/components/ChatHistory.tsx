import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import ChatHistoryService, { type ChatHistoryItem, type ChatSession } from '../services/chatHistoryService';
import type { Symptom } from '../services/openaiService';
import './ChatHistory.css';

interface ChatHistoryProps {
  onLoadSession: (symptoms: Symptom[]) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onLoadSession }) => {
  const [user] = useAuthState(auth);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  const chatHistoryService = ChatHistoryService.getInstance();

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const history = await chatHistoryService.getChatHistory(user.uid);
      setChatHistory(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFullSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      const session = await chatHistoryService.getChatSession(user.uid, sessionId);
      if (session) {
        setSelectedSession(session);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const handleRestoreSession = (symptoms: Symptom[]) => {
    onLoadSession(symptoms);
    setSelectedSession(null);
  };

  const clearHistory = async () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      try {
        await chatHistoryService.clearChatHistory(user.uid);
        setChatHistory([]);
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getUrgencyIcon = (urgencyLevel: string) => {
    switch (urgencyLevel.toLowerCase()) {
      case 'emergency': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔶';
      case 'low': return '✅';
      default: return '📋';
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="chat-history loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="chat-history">
      <div className="history-header">
        <h3>📚 Chat History</h3>
        {chatHistory.length > 0 && (
          <button onClick={clearHistory} className="clear-history-btn" title="Clear all history">
            🗑️ Clear
          </button>
        )}
      </div>

      {chatHistory.length === 0 ? (
        <div className="empty-history">
          <p>💬 No previous conversations found</p>
          <p>Start analyzing symptoms to build your health history!</p>
        </div>
      ) : (
        <div className="history-list">
          {chatHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-main" onClick={() => loadFullSession(item.id)}>
                <div className="history-item-header">
                  <span className="urgency-icon">
                    {getUrgencyIcon(item.urgencyLevel)}
                  </span>
                  <h4 className="session-title">{item.sessionTitle}</h4>
                  <span className="session-date">{formatDate(item.timestamp)}</span>
                </div>
                <div className="symptoms-preview">
                  {item.symptoms.slice(0, 3).map((symptom, index) => (
                    <span key={index} className="symptom-tag">
                      {symptom.name} ({symptom.severity})
                    </span>
                  ))}
                  {item.symptoms.length > 3 && (
                    <span className="more-symptoms">+{item.symptoms.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="session-modal-overlay" onClick={() => setSelectedSession(null)}>
          <div className="session-modal" onClick={(e) => e.stopPropagation()}>
            <div className="session-modal-header">
              <h3>{selectedSession.sessionTitle}</h3>
              <button 
                onClick={() => setSelectedSession(null)} 
                className="close-btn"
              >
                ✕
              </button>
            </div>
            
            <div className="session-modal-content">
              <div className="session-symptoms">
                <h4>🔍 Symptoms Analyzed:</h4>
                <div className="symptoms-list">
                  {selectedSession.symptoms.map((symptom, index) => (
                    <div key={index} className="symptom-detail">
                      <span className="symptom-name">{symptom.name}</span>
                      <span className={`severity-badge severity-${symptom.severity}`}>
                        {symptom.severity}
                      </span>
                      {symptom.duration && (
                        <span className="symptom-duration">Duration: {symptom.duration}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="session-analysis">
                <h4>🤖 AI Analysis:</h4>
                <p className="analysis-summary">{selectedSession.analysisResult.summary}</p>
                
                <div className="analysis-urgency">
                  <strong>Urgency: </strong>
                  <span className={`urgency-badge urgency-${selectedSession.analysisResult.urgencyLevel}`}>
                    {selectedSession.analysisResult.urgencyLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="session-modal-actions">
              <button 
                onClick={() => handleRestoreSession(selectedSession.symptoms)}
                className="restore-btn"
              >
                🔄 Restore Session
              </button>
              <button 
                onClick={() => setSelectedSession(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
