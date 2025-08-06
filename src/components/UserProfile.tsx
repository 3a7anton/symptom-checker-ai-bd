import React, { useState } from 'react';
import { signOut } from '../services/authService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import './UserProfile.css';

interface UserProfileProps {
  onChatHistoryToggle: () => void;
  showChatHistory: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ onChatHistoryToggle, showChatHistory }) => {
  const [user] = useAuthState(auth);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="user-avatar">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className="user-details">
          <h3 className="user-name">
            {user.displayName || 'User'}
          </h3>
          <p className="user-email">{user.email}</p>
        </div>
      </div>
      
      <div className="user-actions">
        <button 
          onClick={onChatHistoryToggle}
          className={`history-btn ${showChatHistory ? 'active' : ''}`}
          title={showChatHistory ? 'Hide chat history' : 'Show chat history'}
        >
          {showChatHistory ? '📖' : '📚'} History
        </button>
        
        <button 
          onClick={handleSignOut}
          className="signout-btn"
          title="Sign out"
          disabled={isSigningOut}
        >
          {isSigningOut ? '⏳ Signing Out...' : '🚪 Sign Out'}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
