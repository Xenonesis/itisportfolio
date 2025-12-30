# 🤝 Contributing to Portfolio

First off, thank you for considering contributing to this portfolio project! It's people like you that make the open source community such a fantastic place to learn, inspire, and create.

## 📑 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

---

## 📜 Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to make participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to a positive environment:**

- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints and experiences
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what is best for the community
- ✅ Showing empathy towards other community members

**Examples of unacceptable behavior:**

- ❌ The use of sexualized language or imagery and unwelcome sexual attention or advances
- ❌ Trolling, insulting/derogatory comments, and personal or political attacks
- ❌ Public or private harassment
- ❌ Publishing others' private information without explicit permission
- ❌ Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at **itisaddy7@gmail.com**. All complaints will be reviewed and investigated promptly and fairly.

---

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome 120, Firefox 121]
 - Version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

**Enhancement Template:**

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Mockups/Examples**
If applicable, include mockups or examples of similar implementations.
```

### 🔧 Code Contributions

1. **Fork the repository**
2. **Create a new branch** from `main`
3. **Make your changes**
4. **Test your changes** thoroughly
5. **Commit** using conventional commits
6. **Push** to your fork
7. **Submit a Pull Request**

---

## 🚀 Development Setup

### Prerequisites

Ensure you have the following installed:

```bash
Node.js 18.x or higher
npm 9.x or higher (or pnpm/yarn)
Git 2.x or higher
```

### Local Setup

```bash
# 1. Fork the repo on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio

# 3. Add upstream remote
git remote add upstream https://github.com/Xenonesis/portfolio.git

# 4. Install dependencies
npm install

# 5. Create .env.local file
cat > .env.local << EOF
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_GA_ID=your_google_analytics_id
EOF

# 6. Start development server
npm run dev

# 7. Open http://localhost:3000
```

### Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/amazing-feature

# 2. Make your changes
# ... edit files ...

# 3. Run linting
npm run lint

# 4. Build to ensure no errors
npm run build

# 5. Commit your changes
git add .
git commit -m "feat: add amazing feature"

# 6. Push to your fork
git push origin feature/amazing-feature

# 7. Open a Pull Request on GitHub
```

### Keeping Your Fork Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Merge upstream/main into your main branch
git checkout main
git merge upstream/main

# Push updates to your fork
git push origin main
```

---

## 📁 Project Structure

Understanding the project structure will help you navigate and contribute effectively:

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   └── chat/          # AI Chat endpoint
│   │   ├── links/             # Links page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── animations/        # Animation components
│   │   ├── backgrounds/       # Background effects
│   │   ├── icons/             # Custom icons
│   │   └── *.tsx              # Feature components
│   ├── lib/                   # Utilities and helpers
│   └── utilities/             # Additional utilities
├── public/                    # Static assets
├── .eslintrc.json            # ESLint config
├── next.config.mjs           # Next.js config
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # Documentation
```

### Key Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `src/app/page.tsx` | Main portfolio page | Adding/modifying sections |
| `src/components/AIAssistant.tsx` | AI chat component | AI features |
| `src/app/api/chat/route.ts` | Chat API endpoint | Backend logic |
| `src/app/globals.css` | Global styles | Design changes |
| `src/utilities/socialMedia.ts` | Social links | Contact info |
| `next.config.mjs` | Next.js settings | Build config |

---

## 📏 Coding Standards

### TypeScript

- ✅ Use TypeScript for all new files
- ✅ Define interfaces for all props and data structures
- ✅ Avoid `any` type unless absolutely necessary
- ✅ Use strict mode

**Example:**

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = "primary",
  disabled = false 
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

// ❌ Bad
export const Button = (props: any) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### React Components

- ✅ Use functional components with hooks
- ✅ Extract reusable logic into custom hooks
- ✅ Keep components under 300 lines
- ✅ Use meaningful component and variable names
- ✅ Add JSDoc comments for complex functions

**Example:**

```typescript
// ✅ Good
/**
 * Custom hook for managing theme state
 * @returns {object} theme state and setter
 */
const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  }, []);
  
  return { theme, toggleTheme };
};

// ❌ Bad
const useTheme = () => {
  const [t, setT] = useState("light");
  return { t, setT };
};
```

### CSS/Styling

- ✅ Use TailwindCSS utility classes
- ✅ Create custom utilities in `globals.css` for repeated patterns
- ✅ Use CSS variables for theme colors
- ✅ Follow mobile-first responsive design

**Example:**

```tsx
// ✅ Good
<div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 lg:py-16">
  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
    Title
  </h1>
</div>

// ❌ Bad
<div style={{ width: "100%", padding: "20px" }}>
  <h1 style={{ fontSize: "24px" }}>Title</h1>
</div>
```

### File Naming

- ✅ Use PascalCase for component files: `MyComponent.tsx`
- ✅ Use camelCase for utilities: `myUtility.ts`
- ✅ Use kebab-case for CSS files: `my-styles.css`
- ✅ Use lowercase for route folders: `my-route/page.tsx`

### Code Organization

```typescript
// ✅ Good structure
// 1. Imports
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Constants
const ANIMATION_DURATION = 0.3;

// 4. Component
export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  // 4a. Hooks
  const [isVisible, setIsVisible] = useState(false);
  
  // 4b. Effects
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // 4c. Handlers
  const handleClick = () => {
    console.log("Clicked");
  };
  
  // 4d. Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: ANIMATION_DURATION }}
      onClick={handleClick}
    >
      <h1>{title}</h1>
    </motion.div>
  );
};
```

---

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(chat): add export conversation` |
| `fix` | Bug fix | `fix(theme): resolve dark mode flash` |
| `docs` | Documentation only | `docs(readme): update installation steps` |
| `style` | Code style changes | `style(button): fix indentation` |
| `refactor` | Code refactoring | `refactor(api): simplify chat logic` |
| `perf` | Performance improvements | `perf(canvas): optimize dot rendering` |
| `test` | Adding tests | `test(utils): add unit tests` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies` |
| `ci` | CI/CD changes | `ci(github): add deployment workflow` |
| `build` | Build system changes | `build(webpack): update config` |

### Examples

```bash
# Feature
git commit -m "feat(ai): add regenerate response button"

# Bug fix
git commit -m "fix(mobile): resolve navigation menu overflow"

# Documentation
git commit -m "docs(contributing): add testing guidelines"

# Performance
git commit -m "perf(particles): reduce particle count on mobile"

# Breaking change
git commit -m "feat(api)!: change chat endpoint response format

BREAKING CHANGE: Response now returns { data, error } instead of { message }"
```

### Commit Best Practices

- ✅ Use present tense: "add feature" not "added feature"
- ✅ Use imperative mood: "move cursor to..." not "moves cursor to..."
- ✅ First line max 72 characters
- ✅ Reference issues: "fix #123" or "closes #456"
- ✅ Explain *what* and *why*, not *how*

---

## 🔀 Pull Request Process

### Before Submitting

1. ✅ Ensure your code follows the coding standards
2. ✅ Update documentation if needed
3. ✅ Add tests for new features
4. ✅ Run `npm run lint` and fix any issues
5. ✅ Run `npm run build` successfully
6. ✅ Test your changes locally
7. ✅ Update CHANGELOG.md (if applicable)

### PR Title Format

Follow the same convention as commits:

```
feat(component): add new animation variant
fix(api): handle null response from Groq
docs(readme): update deployment guide
```

### PR Description Template

```markdown
## 📋 Description

Brief description of what this PR does.

## 🎯 Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## 🧪 How Has This Been Tested?

Describe the tests you ran:

- [ ] Local development server
- [ ] Production build
- [ ] Mobile responsiveness
- [ ] Different browsers
- [ ] Accessibility testing

**Test Configuration:**
- Node version: 18.x
- npm version: 9.x
- Browser: Chrome 120

## 📸 Screenshots (if applicable)

Add screenshots or GIFs showing the changes.

## ✅ Checklist

- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published

## 📚 Related Issues

Closes #(issue number)
Related to #(issue number)

## 🔗 Additional Context

Add any other context about the PR here.
```

### Review Process

1. **Automated Checks**: CI/CD will run automatically
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged
5. **Merge**: Squash and merge by default

### After Merge

- Your contribution will be credited in CHANGELOG.md
- The feature will be included in the next release
- You'll be added to the contributors list

---

## 🐛 Issue Guidelines

### Issue Types

We use labels to categorize issues:

| Label | Description | Color |
|-------|-------------|-------|
| `bug` | Something isn't working | 🔴 Red |
| `enhancement` | New feature or request | 🟢 Green |
| `documentation` | Documentation improvements | 🔵 Blue |
| `good first issue` | Good for newcomers | 🟣 Purple |
| `help wanted` | Extra attention is needed | 🟡 Yellow |
| `question` | Further information is requested | 💬 Gray |
| `wontfix` | This will not be worked on | ⚫ Black |
| `duplicate` | This issue already exists | 🟠 Orange |

### Creating Quality Issues

**Good Issue Example:**

```markdown
**Title:** Dark mode toggle not persisting across page refreshes

**Labels:** bug, help wanted

**Description:**
When I toggle to dark mode and refresh the page, it reverts to light mode.

**Steps to Reproduce:**
1. Go to homepage
2. Click theme toggle to switch to dark mode
3. Refresh the page
4. Theme is back to light mode

**Expected Behavior:**
Theme preference should persist across refreshes using localStorage.

**Environment:**
- Browser: Chrome 120
- OS: macOS 14.1
- Device: MacBook Pro 2021

**Additional Context:**
Looking at the console, I see localStorage is being set correctly, but it seems like there's a hydration issue.

**Possible Solution:**
Maybe we need to use `useEffect` to read from localStorage after mount?
```

---

## 🧪 Testing

### Manual Testing Checklist

Before submitting your PR, test the following:

#### Functionality
- [ ] All features work as expected
- [ ] No console errors or warnings
- [ ] API endpoints return correct responses
- [ ] Forms validate properly
- [ ] Links navigate correctly

#### Responsive Design
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1920px+)

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Sufficient color contrast
- [ ] Focus indicators visible
- [ ] Alt text on images

#### Performance
- [ ] Page load time < 3s
- [ ] No layout shifts (CLS)
- [ ] Smooth animations (60fps)
- [ ] Optimized images

### Future: Automated Testing

We plan to add:

```bash
# Unit tests with Vitest
npm run test

# E2E tests with Playwright
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 📚 Documentation

### When to Update Documentation

Update documentation when you:

- ✅ Add a new feature
- ✅ Change existing functionality
- ✅ Fix a bug that affects usage
- ✅ Add new dependencies
- ✅ Change configuration
- ✅ Add new environment variables

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `CONTRIBUTING.md` | Contribution guidelines |
| `CHANGELOG.md` | Version history |
| `API.md` | API documentation |

### JSDoc Comments

Add JSDoc for exported functions:

```typescript
/**
 * Fetches user data from GitHub API
 * @param {string} username - GitHub username
 * @returns {Promise<GitHubUser>} User data
 * @throws {Error} If user not found
 * 
 * @example
 * const user = await fetchGitHubUser("Xenonesis");
 * console.log(user.name); // "Aditya Kumar Tiwari"
 */
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) throw new Error("User not found");
  return response.json();
}
```

---

## 🌟 Community

### Getting Help

- 💬 **GitHub Discussions**: Ask questions and share ideas
- 🐛 **GitHub Issues**: Report bugs and request features
- 📧 **Email**: itisaddy7@gmail.com for private inquiries
- 🔗 **LinkedIn**: [linkedin.com/in/itisaddy](https://www.linkedin.com/in/itisaddy/)

### Recognition

Contributors will be:

- ✅ Listed in CHANGELOG.md for their contributions
- ✅ Mentioned in release notes
- ✅ Added to GitHub contributors graph
- ✅ Credited in README.md (for significant contributions)

### Contributor Roles

| Role | Responsibilities |
|------|------------------|
| **Contributor** | Submit PRs, report issues |
| **Reviewer** | Review PRs, provide feedback |
| **Maintainer** | Merge PRs, manage releases |
| **Owner** | Final decision on project direction |

---

## 🎉 Thank You!

Every contribution, no matter how small, is valuable and appreciated. Whether it's:

- 🐛 Reporting a bug
- 💡 Suggesting a feature
- 📝 Improving documentation
- 🔧 Fixing an issue
- ⭐ Starring the repo
- 📢 Sharing the project

**You're making this project better!**

---

## 📖 Additional Resources

### Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

### Tools & Extensions

- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting
- [GitHub Desktop](https://desktop.github.com/) - Git GUI
- [VSCode](https://code.visualstudio.com/) - Recommended editor
- [React Developer Tools](https://react.dev/learn/react-developer-tools) - Browser extension

---

<div align="center">

**Made with 💙 by [Aditya Kumar Tiwari](https://github.com/Xenonesis)**

**[⬆ Back to Top](#-contributing-to-portfolio)**

</div>
