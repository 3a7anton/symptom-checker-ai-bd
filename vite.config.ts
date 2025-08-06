import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor dependencies
          'vendor-react': ['react', 'react-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'vendor-gsap': ['gsap'],
          'vendor-lenis': ['lenis'],
          
          // AI and OpenAI related
          'ai-services': ['openai'],
          
          // UI components
          'components': [
            './src/components/LandingPage',
            './src/components/AuthComponent', 
            './src/components/SymptomChecker',
            './src/components/UserProfile',
            './src/components/ChatHistory'
          ],
          
          // Services and utilities
          'services': [
            './src/services/openaiService',
            './src/services/authService',
            './src/services/chatHistoryService'
          ]
        }
      }
    },
    // Reduce chunk size warning threshold
    chunkSizeWarningLimit: 500,
    // Enable source maps for debugging (optional, remove for smaller builds)
    sourcemap: false
  }
})
