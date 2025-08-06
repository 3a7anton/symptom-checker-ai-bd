# Security Policy

## Supported Versions

We actively support the following versions of the AI Symptom Checker:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| 0.x.x   | ❌ No (Beta only)  |

## Reporting a Vulnerability

We take the security of AI Symptom Checker seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Email**: Send details to the project maintainer at [security email]
2. **GitHub Security Advisory**: Use the "Report a vulnerability" feature in the Security tab
3. **Private Contact**: Reach out to [@3a7anton](https://github.com/3a7anton) directly

### What to Include

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### Response Timeline

- **Initial Response**: Within 48 hours of receiving the report
- **Status Update**: Within 7 days with either a resolution or detailed plan
- **Resolution**: Critical issues within 30 days, others within 90 days

### Disclosure Policy

- We will investigate and respond to all legitimate reports
- We will work with reporters to understand and resolve issues
- We will acknowledge your contribution (unless you prefer to remain anonymous)
- We ask that you give us reasonable time to address issues before public disclosure

## Security Best Practices

### For Users

1. **Environment Variables**: Never commit API keys or sensitive configuration to version control
2. **HTTPS**: Always use the application over HTTPS in production
3. **Updates**: Keep your deployment updated with the latest version
4. **Authentication**: Use strong passwords and enable 2FA where possible

### For Contributors

1. **Dependencies**: Regularly audit and update dependencies
2. **Input Validation**: Validate all user inputs on both client and server sides
3. **API Security**: Implement proper rate limiting and authentication
4. **Error Handling**: Avoid exposing sensitive information in error messages

## Known Security Considerations

### Client-Side API Keys

This application uses environment variables for API keys that are bundled into the client-side code. While this is common for frontend applications, be aware that:

- API keys are visible to users who inspect the application
- Use API key restrictions and rate limiting on your providers
- Monitor API usage for unusual patterns
- Consider implementing a backend proxy for sensitive operations

### Firebase Security

When using Firebase features:

- Configure proper Firestore security rules
- Limit authentication domains to your deployment URLs
- Monitor authentication logs for suspicious activity
- Use Firebase's built-in security features

## Scope

This security policy applies to:

- The main AI Symptom Checker application code
- Official deployment configurations
- Documentation and guides

This policy does NOT cover:

- Third-party services (OpenRouter, Firebase) - report to their respective security teams
- User-generated content or user configurations
- Issues in forked or modified versions

## Contact

For any questions about this security policy, please contact:

- **Project Maintainer**: [@3a7anton](https://github.com/3a7anton)
- **Security Email**: [To be configured]

---

Thank you for helping keep AI Symptom Checker and our users safe! 🛡️
