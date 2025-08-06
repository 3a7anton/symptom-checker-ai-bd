# Contributing to AI Symptom Checker

Thank you for your interest in contributing to the AI Symptom Checker project! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Firebase

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/ai-symptom-checker.git
   cd ai-symptom-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Edit .env.local with your actual API keys (optional for development)
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create a detailed bug report** with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Browser/OS information
   - Console errors (if any)

### Suggesting Features

1. **Check existing feature requests**
2. **Create a feature request** with:
   - Clear use case description
   - Detailed functionality explanation
   - Mockups or wireframes (if applicable)
   - Implementation considerations

### Code Contributions

#### Branch Naming Convention
- `feature/short-description` - New features
- `fix/short-description` - Bug fixes
- `docs/short-description` - Documentation updates
- `style/short-description` - Code style improvements
- `refactor/short-description` - Code refactoring

#### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add TypeScript types
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run build  # Ensure build works
   npm run lint   # Check for linting errors
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use a clear, descriptive title
   - Reference related issues
   - Provide detailed description of changes
   - Include screenshots for UI changes

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable and function names

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement proper error boundaries

### CSS
- Use CSS modules or styled-components
- Follow mobile-first responsive design
- Maintain glassmorphism design system
- Use CSS custom properties for theming

### File Organization
```
src/
├── components/     # Reusable UI components
├── services/       # Business logic services
├── hooks/          # Custom React hooks
├── config/         # Configuration files
├── assets/         # Static assets
└── types/          # TypeScript type definitions
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test with and without API keys
- [ ] Test authentication flow
- [ ] Test offline functionality
- [ ] Test responsive design at different breakpoints

### Automated Testing (Future)
We welcome contributions to add automated testing:
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress

## 🎨 Design Guidelines

### UI/UX Principles
- **Mobile-first**: Design for mobile, enhance for desktop
- **Accessibility**: Follow WCAG guidelines
- **Performance**: Optimize for fast loading
- **Glassmorphism**: Maintain consistent glass-like effects
- **Progressive Enhancement**: Work without JavaScript

### Color Scheme
- Primary gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Accent colors: `#4ecdc4`, `#ff6b6b`, `#ffc107`
- Glass effects: `rgba(255, 255, 255, 0.1)` with `backdrop-filter: blur(10px)`

## 🔧 Development Tools

### Recommended VSCode Extensions
- TypeScript Importer
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

### Code Formatting
The project uses ESLint for code quality. Run before committing:
```bash
npm run lint
```

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers to the project
- Focus on the issue, not the person

### Communication
- Use clear, concise language
- Provide context for decisions
- Ask questions when uncertain
- Share knowledge with others

## 🏷️ Versioning

We use [Semantic Versioning](http://semver.org/):
- **Major** (x.0.0): Breaking changes
- **Minor** (0.x.0): New features, backwards compatible
- **Patch** (0.0.x): Bug fixes, backwards compatible

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md acknowledgments section
- GitHub contributors page
- Release notes (for significant contributions)

## ❓ Need Help?

- **Documentation**: Check the README.md
- **Issues**: Browse existing issues on GitHub
- **Discussions**: Join GitHub Discussions for questions
- **Contact**: Reach out to [@3a7anton](https://github.com/3a7anton)

## 🎯 Priority Areas

We especially welcome contributions in these areas:
- **Accessibility improvements**
- **Mobile optimization**
- **Performance enhancements**
- **Documentation updates**
- **Bug fixes**
- **Test coverage**

---

Thank you for contributing to AI Symptom Checker! 🩺✨
