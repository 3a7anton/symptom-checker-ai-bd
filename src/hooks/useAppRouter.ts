import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

export type AppView = 'landing' | 'demo' | 'main' | 'auth';

interface AppState {
  currentView: AppView;
  user: User | null;
  isAuthenticated: boolean;
  demoUsesLeft: number;
}

export const useAppRouter = () => {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'landing',
    user: null,
    isAuthenticated: false,
    demoUsesLeft: 2, // Free demo uses
  });

  // Check if Firebase is disabled
  const isFirebaseDisabled = import.meta.env.VITE_DISABLE_FIREBASE === 'true';

  // Listen to authentication state
  useEffect(() => {
    if (!auth || isFirebaseDisabled) {
      console.log('Firebase auth disabled - running in demo mode');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAppState(prev => {
        // If user signs in, go to main
        if (user && !prev.isAuthenticated) {
          return {
            ...prev,
            user,
            isAuthenticated: true,
            currentView: 'main',
          };
        }
        
        // If user signs out, go back to landing page
        if (!user && prev.isAuthenticated) {
          return {
            ...prev,
            user: null,
            isAuthenticated: false,
            currentView: 'landing',
          };
        }

        // Otherwise, just update the user state without changing view
        return {
          ...prev,
          user,
          isAuthenticated: !!user,
        };
      });
    });

    return () => unsubscribe();
  }, [isFirebaseDisabled]);

  // Load demo uses from localStorage
  useEffect(() => {
    const savedDemoUses = localStorage.getItem('symptomCheckerDemoUses');
    if (savedDemoUses) {
      const usesLeft = parseInt(savedDemoUses, 10);
      setAppState(prev => ({
        ...prev,
        demoUsesLeft: Math.max(0, usesLeft),
      }));
    }
  }, []);

  const navigateTo = (view: AppView) => {
    setAppState(prev => ({
      ...prev,
      currentView: view,
    }));
  };

  const useDemoAnalysis = () => {
    if (appState.demoUsesLeft > 0) {
      const newUsesLeft = appState.demoUsesLeft - 1;
      setAppState(prev => ({
        ...prev,
        demoUsesLeft: newUsesLeft,
      }));
      localStorage.setItem('symptomCheckerDemoUses', newUsesLeft.toString());
      return true;
    }
    return false;
  };

  const resetDemoUses = () => {
    setAppState(prev => ({
      ...prev,
      demoUsesLeft: 2,
    }));
    localStorage.setItem('symptomCheckerDemoUses', '2');
  };

  return {
    ...appState,
    navigateTo,
    useDemoAnalysis,
    resetDemoUses,
  };
};
