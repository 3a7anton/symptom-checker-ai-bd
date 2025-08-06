# 🚀 Deployment Guide

This guide covers different deployment options for the AI Symptom Checker application.

## 📋 Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Firebase project set up (if using auth/database features)
- [ ] OpenRouter API key obtained (if using AI features)
- [ ] Code linted and built successfully
- [ ] Mobile responsiveness tested
- [ ] All features tested in production mode

## 🔧 Build for Production

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deployment Options

### 1. Vercel (Recommended)

Vercel offers seamless deployment with automatic builds and deployments from GitHub.

#### Steps:
1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" and import your GitHub repository

2. **Configure Environment Variables**
   ```
   VITE_OPENROUTER_API_KEY=your_actual_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Deploy**
   - Click "Deploy"
   - Automatic deployments will trigger on every push to main branch

#### Vercel Configuration (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Firebase Hosting

Perfect integration if you're already using Firebase for authentication and database.

#### Steps:
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html: `No`

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

#### Firebase Configuration (firebase.json)
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

### 3. Netlify

Great for static sites with easy continuous deployment.

#### Steps:
1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   Add the same environment variables as listed for Vercel

4. **Deploy**
   - Automatic deployments on every push

#### Netlify Configuration (_redirects)
Create a `public/_redirects` file:
```
/*    /index.html   200
```

### 4. GitHub Pages

Free hosting for public repositories.

#### Steps:
1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add Deploy Script**
   Add to package.json:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/ai-symptom-checker"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**
   - Go to repository Settings > Pages
   - Select `gh-pages` branch as source

### 5. AWS S3 + CloudFront

For enterprise deployments with CDN.

#### Steps:
1. **Create S3 Bucket**
   - Enable static website hosting
   - Upload dist folder contents

2. **Configure CloudFront**
   - Create distribution pointing to S3 bucket
   - Set up custom error pages (404 → /index.html)

3. **Deploy with AWS CLI**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use platform-specific environment variable management
- Rotate API keys regularly

### HTTPS
- Always use HTTPS in production
- Most deployment platforms provide HTTPS by default
- Configure proper security headers

### Content Security Policy (CSP)
Add to your hosting platform or index.html:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Restart development server after adding variables
   - Check platform-specific environment variable syntax

3. **Firebase Authentication Issues**
   - Add your domain to Firebase Auth authorized domains
   - Check Firebase configuration values
   - Ensure Firebase project has required services enabled

4. **API Calls Failing**
   - Check CORS settings
   - Verify API key format and permissions
   - Test API endpoints directly

5. **Mobile Issues**
   - Test on actual devices, not just browser dev tools
   - Check viewport meta tag
   - Verify touch target sizes

### Performance Optimization

1. **Lighthouse Audit**
   ```bash
   npm run build
   npm run preview
   # Then run Lighthouse audit in Chrome DevTools
   ```

2. **Bundle Analysis**
   ```bash
   npm install --save-dev rollup-plugin-analyzer
   # Add to vite.config.ts and analyze build
   ```

## 📊 Monitoring

### Analytics Setup
- Google Analytics 4
- Firebase Analytics (if using Firebase)
- Custom event tracking for user interactions

### Error Monitoring
- Sentry for error tracking
- Firebase Crashlytics
- Console error monitoring

### Performance Monitoring
- Web Vitals tracking
- Firebase Performance
- Custom performance metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test # when tests are added
    
    - name: Build
      run: npm run build
      env:
        VITE_OPENROUTER_API_KEY: ${{ secrets.VITE_OPENROUTER_API_KEY }}
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 🆘 Need Help?

- Check the [main README](README.md) for general setup
- Review [contributing guidelines](CONTRIBUTING.md) for development setup
- Open an issue on GitHub for deployment-specific problems
- Contact [@3a7anton](https://github.com/3a7anton) for urgent issues
