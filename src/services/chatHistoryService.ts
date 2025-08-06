// Chat history service for storing and retrieving user conversations
import { collection, addDoc, query, where, orderBy, getDocs, type DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Symptom, AnalysisResult } from './openaiService';

export interface ChatSession {
  id?: string;
  userId: string;
  timestamp: Date;
  symptoms: Symptom[];
  analysisResult: AnalysisResult;
  sessionTitle?: string;
}

export interface ChatHistoryItem {
  id: string;
  timestamp: Date;
  sessionTitle: string;
  symptoms: Symptom[];
  urgencyLevel: string;
}

export class ChatHistoryService {
  private static instance: ChatHistoryService;
  private readonly COLLECTION_NAME = 'chatHistory';
  private readonly LOCAL_STORAGE_KEY = 'symptomChecker_chatHistory';

  public static getInstance(): ChatHistoryService {
    if (!ChatHistoryService.instance) {
      ChatHistoryService.instance = new ChatHistoryService();
    }
    return ChatHistoryService.instance;
  }

  // Generate a session title from symptoms
  private generateSessionTitle(symptoms: Symptom[]): string {
    if (symptoms.length === 0) return 'Symptom Analysis';
    
    const mainSymptoms = symptoms.slice(0, 2).map(s => s.name);
    const title = mainSymptoms.join(', ');
    
    const date = new Date().toLocaleDateString();
    return `${title} - ${date}`;
  }

  // Save chat session to Firebase (if available) and localStorage
  async saveChatSession(userId: string, symptoms: Symptom[], analysisResult: AnalysisResult): Promise<string | null> {
    const sessionTitle = this.generateSessionTitle(symptoms);
    const chatSession: ChatSession = {
      userId,
      timestamp: new Date(),
      symptoms,
      analysisResult,
      sessionTitle
    };

    try {
      // Try to save to Firebase first
      if (db) {
        const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
          ...chatSession,
          timestamp: chatSession.timestamp.toISOString() // Convert Date to string for Firebase
        });
        
        // Also save to localStorage as backup
        this.saveToLocalStorage(userId, { ...chatSession, id: docRef.id });
        
        console.log('Chat session saved to Firebase:', docRef.id);
        return docRef.id;
      }
    } catch (error) {
      console.warn('Failed to save to Firebase, using localStorage only:', error);
    }

    // Fallback to localStorage only
    const localId = this.saveToLocalStorage(userId, { ...chatSession, id: Date.now().toString() });
    return localId;
  }

  // Save to localStorage
  private saveToLocalStorage(userId: string, chatSession: ChatSession): string {
    try {
      const existingData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      const allSessions: ChatSession[] = existingData ? JSON.parse(existingData) : [];
      
      // Add new session
      allSessions.push({
        ...chatSession,
        timestamp: new Date(chatSession.timestamp) // Ensure it's a Date object
      });
      
      // Keep only last 50 sessions per user to avoid localStorage bloat
      const userSessions = allSessions
        .filter(session => session.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 50);
      
      // Combine with other users' sessions
      const otherUsersSessions = allSessions.filter(session => session.userId !== userId);
      const updatedSessions = [...userSessions, ...otherUsersSessions];
      
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(updatedSessions));
      return chatSession.id || Date.now().toString();
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return '';
    }
  }

  // Get chat history for a user
  async getChatHistory(userId: string): Promise<ChatHistoryItem[]> {
    let sessions: ChatSession[] = [];

    try {
      // Try to get from Firebase first
      if (db) {
        const q = query(
          collection(db, this.COLLECTION_NAME),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        sessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: new Date(doc.data().timestamp) // Convert back to Date
        } as ChatSession));
        
        console.log(`Loaded ${sessions.length} sessions from Firebase`);
      }
    } catch (error) {
      console.warn('Failed to load from Firebase, using localStorage:', error);
    }

    // If Firebase failed or returned no results, try localStorage
    if (sessions.length === 0) {
      sessions = this.getFromLocalStorage(userId);
    }

    // Convert to ChatHistoryItem format
    return sessions.map(session => ({
      id: session.id || '',
      timestamp: session.timestamp,
      sessionTitle: session.sessionTitle || this.generateSessionTitle(session.symptoms),
      symptoms: session.symptoms,
      urgencyLevel: session.analysisResult.urgencyLevel
    }));
  }

  // Get from localStorage
  private getFromLocalStorage(userId: string): ChatSession[] {
    try {
      const existingData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (!existingData) return [];
      
      const allSessions: ChatSession[] = JSON.parse(existingData);
      return allSessions
        .filter(session => session.userId === userId)
        .map(session => ({
          ...session,
          timestamp: new Date(session.timestamp) // Ensure it's a Date object
        }))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return [];
    }
  }

  // Get a specific chat session
  async getChatSession(userId: string, sessionId: string): Promise<ChatSession | null> {
    try {
      // Try Firebase first
      if (db) {
        const q = query(
          collection(db, this.COLLECTION_NAME),
          where('userId', '==', userId)
        );
        
        const querySnapshot = await getDocs(q);
        const session = querySnapshot.docs
          .find(doc => doc.id === sessionId)
          ?.data() as DocumentData;
        
        if (session) {
          return {
            id: sessionId,
            ...session,
            timestamp: new Date(session.timestamp)
          } as ChatSession;
        }
      }
    } catch (error) {
      console.warn('Failed to load session from Firebase:', error);
    }

    // Fallback to localStorage
    const sessions = this.getFromLocalStorage(userId);
    return sessions.find(session => session.id === sessionId) || null;
  }

  // Clear all chat history for a user
  async clearChatHistory(userId: string): Promise<void> {
    try {
      // Clear from localStorage
      const existingData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (existingData) {
        const allSessions: ChatSession[] = JSON.parse(existingData);
        const filteredSessions = allSessions.filter(session => session.userId !== userId);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(filteredSessions));
      }
      
      console.log('Chat history cleared for user:', userId);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }
}

export default ChatHistoryService;
