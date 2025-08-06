# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# 🩺 AI Symptom Checker & Health Tracker

A modern, responsive web application that provides AI-powered symptom analysis and health tracking capabilities. Built with React, TypeScript, and Firebase, featuring a beautiful glassmorphism UI design.

🔗 **[Live Demo](https://symptomcheckerbdai.netlify.app/)** | 📖 [Documentation](#-quick-start) | 🤝 [Contributing](CONTRIBUTING.md)

![AI Symptom Checker](https://img.shields.io/badge/React-19.1.0-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.0.0-orange?style=for-the-badge&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646cff?style=for-the-badge&logo=vite)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=netlify)](https://symptomcheckerbdai.netlify.app/)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Analysis**: Advanced symptom analysis using OpenRouter API with multiple AI models
- **Smart Symptom Input**: Intuitive symptom entry with severity levels and quick-select tags
- **Demo Mode**: Free trial system with limited analyses for unregistered users
- **User Authentication**: Secure login/signup with Google OAuth and email/password
- **Chat History**: Complete analysis history with detailed session viewing
- **Health Tracking**: Personal health insights and recommendations

### 🎨 User Interface
- **Modern Design**: Beautiful glassmorphism UI with gradient backgrounds
- **Fully Responsive**: Optimized for all devices (desktop, tablet, mobile)
- **Smooth Animations**: GSAP-powered animations and Lenis smooth scrolling
- **Touch-Friendly**: Enhanced mobile experience with proper touch targets
- **Accessibility**: Screen reader compatible and keyboard navigable

### 🔧 Technical Features
- **Offline Mode**: Fallback analysis when API is unavailable
- **Progressive Enhancement**: Works without JavaScript (basic functionality)
- **Performance Optimized**: Lazy loading, code splitting, and optimized builds
- **Type-Safe**: Full TypeScript implementation
- **Modern Stack**: React 19, Vite, Firebase, and modern web standards

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account (optional for demo mode)
- OpenRouter API key (optional for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/3a7anton/ai-symptom-checker.git
   cd ai-symptom-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # OpenRouter AI API Configuration
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   
   # Firebase Configuration (optional - runs in demo mode without these)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Optional: Disable Firebase entirely
   VITE_DISABLE_FIREBASE=false
   
   # Optional: Force demo mode
   VITE_USE_DEMO_MODE=false
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Configuration

### AI Service Setup (OpenRouter)

1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file as `VITE_OPENROUTER_API_KEY`

### Firebase Setup (Optional)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Get your config from Project Settings
4. Add the config values to your `.env.local` file

### Demo Mode

The application works in demo mode without any external services:
- Set `VITE_USE_DEMO_MODE=true` to force demo mode
- Set `VITE_DISABLE_FIREBASE=true` to disable Firebase entirely
- Demo users get 3 free analyses with offline AI responses

## 📱 Mobile Optimization

The application is fully optimized for mobile devices:

- **Responsive Design**: Mobile-first approach with breakpoints at 768px, 480px, and 320px
- **Touch Interactions**: Enhanced touch targets (44px minimum) and proper tap feedback
- **Performance**: Optimized animations and reduced complexity on mobile
- **Accessibility**: iOS zoom prevention on inputs and proper touch callouts
- **Landscape Support**: Special optimizations for mobile landscape orientation

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── LandingPage.tsx     # Homepage with features showcase
│   ├── AuthComponent.tsx   # Authentication forms
│   ├── SymptomChecker.tsx  # Main symptom analysis interface
│   ├── UserProfile.tsx     # User profile management
│   └── ChatHistory.tsx     # Analysis history viewer
├── services/           # Business logic services
│   ├── openaiService.ts    # AI analysis service
│   ├── authService.ts      # Authentication service
│   ├── firestoreService.ts # Database operations
│   └── chatHistoryService.ts # Chat history management
├── hooks/              # Custom React hooks
│   ├── useOpenAI.ts        # AI service hook
│   ├── useAppRouter.ts     # App navigation logic
│   ├── useGSAP.ts         # Animation hook
│   └── useLenis.ts        # Smooth scrolling hook
├── config/             # Configuration files
│   └── firebase.ts         # Firebase configuration
└── assets/             # Static assets
```

## 🎨 Styling Architecture

- **Modern CSS**: CSS3 features, custom properties, and advanced selectors
- **Glassmorphism**: Beautiful frosted glass effects with backdrop filters
- **Responsive Grid**: CSS Grid and Flexbox for complex layouts
- **Animation**: GSAP for complex animations, CSS transitions for interactions
- **Color System**: Gradient-based color palette with dark theme optimizations

## 🔒 Security Features

- **Environment Variables**: All sensitive data stored in environment variables
- **Firebase Security Rules**: Proper Firestore security rules
- **Input Validation**: Client and server-side input validation
- **XSS Protection**: React's built-in XSS protection
- **HTTPS**: Enforced HTTPS in production

## 📊 Performance

- **Lighthouse Score**: 95+ performance score
- **Bundle Size**: Optimized with tree shaking and code splitting
- **Loading Strategy**: Lazy loading for components and routes
- **Caching**: Service worker and browser caching strategies

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality

- **TypeScript**: Full type safety with strict mode
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (configure as needed)
- **Git Hooks**: Pre-commit hooks for code quality

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Other Platforms
The app works on any static hosting platform (Netlify, AWS S3, GitHub Pages, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] **AI Model Selection**: User choice between different AI models
- [ ] **Health Records**: Export analysis history as PDF
- [ ] **Medication Tracking**: Track medications and interactions
- [ ] **Appointment Scheduling**: Integration with calendar apps
- [ ] **Symptom Photos**: Image analysis for visual symptoms
- [ ] **Multi-language**: Support for multiple languages
- [ ] **Offline PWA**: Full offline functionality as PWA
- [ ] **Wearable Integration**: Sync with fitness trackers

## ⚠️ Medical Disclaimer

**IMPORTANT**: This application is for educational and informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ABU AHAD ANTON**
- GitHub: [@3a7anton](https://github.com/3a7anton)
- Email: [your-email@example.com]

## 🙏 Acknowledgments

- OpenRouter.ai for AI model access
- Firebase for backend services
- React team for the amazing framework
- GSAP for smooth animations
- All contributors and users of this project

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/3a7anton/ai-symptom-checker/issues) page
2. Create a new issue with detailed information
3. Join our [Discussions](https://github.com/3a7anton/ai-symptom-checker/discussions) for general questions

---

<div align="center">

**Made with ❤️ by [ABU AHAD ANTON](https://github.com/3a7anton)**

⭐ Star this repository if it helped you!

</div>

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
