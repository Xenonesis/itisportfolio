# 📋 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 📖 Version Format

- **MAJOR** version: Incompatible API changes
- **MINOR** version: New functionality (backward-compatible)
- **PATCH** version: Bug fixes (backward-compatible)

## 🏷️ Types of Changes

- ✨ **Added** - New features
- 🔄 **Changed** - Changes in existing functionality
- 🗑️ **Deprecated** - Soon-to-be removed features
- ❌ **Removed** - Removed features
- 🐛 **Fixed** - Bug fixes
- 🔒 **Security** - Security vulnerabilities

---

## [Unreleased]

### 🚀 Planned Features
- Blog section with MDX support
- Project gallery with detailed case studies
- Contact form with email integration
- Newsletter subscription
- Multi-language support (i18n)
- PWA capabilities
- Advanced analytics dashboard

---

## [2.0.0] - 2025-12-31

### ✨ Added
- **AI Chat Assistant**: Groq-powered LLaMA 3.3 70B integration
  - Real-time GitHub data fetching
  - Conversation export (TXT/JSON)
  - Reaction system (like/dislike)
  - Regenerate responses
  - Quick action links
  - Keyboard shortcuts (Ctrl+K to open)
  - Message history management
  - 794 lines of sophisticated chat interface

- **Interactive Backgrounds**:
  - Dot Grid Background with physics simulation
  - Particles Background with Three.js WebGL
  - Mouse proximity effects
  - Shock wave propagation
  - Theme-aware colors

- **Advanced Animation System**:
  - Custom AnimateIn component
  - 5 animation variants (fadeUp, fadeLeft, fadeRight, scale, reveal)
  - IntersectionObserver for scroll triggers
  - Configurable delays and thresholds

- **GitHub Integration**:
  - Live contribution heatmap
  - Real-time repository statistics
  - Activity visualization
  - Hover tooltips with details

- **Visitor Detection System**:
  - Browser detection (Chrome, Firefox, Safari, Edge, Brave, Opera)
  - OS detection (Windows, macOS, Linux, Android, iOS)
  - Personalized greeting messages
  - SVG logo display

- **Theme System**:
  - Dark/Light/System theme modes
  - Persistent theme storage
  - Smooth theme transitions
  - System preference detection
  - Custom theme toggle component

- **Documentation**:
  - Comprehensive README.md (1,158+ lines)
  - CONTRIBUTING.md with detailed guidelines
  - CHANGELOG.md for version tracking
  - API.md for endpoint documentation

### 🔄 Changed
- **Next.js 16.1.1**: Upgraded to latest version with Turbopack
- **React 19.2.3**: Updated to React 19 with new features
- **TailwindCSS 4**: Migrated to TailwindCSS v4
- **Static Export**: Changed to static site generation for better deployment
- **Font System**: Switched to Geist Sans and Geist Mono
- **Project Structure**: Reorganized components and utilities

### 🐛 Fixed
- Theme flash on page load (hydration issue)
- Mobile navigation overflow
- Canvas performance on low-end devices
- GitHub API rate limiting
- Accessibility issues with keyboard navigation
- Dark mode color contrast ratios

### 🔒 Security
- Environment variable validation
- API key protection
- Input sanitization for AI chat
- CORS configuration
- XSS prevention measures

### 📦 Dependencies
- Added `groq-sdk` for AI integration
- Added `three` and `@react-three/fiber` for 3D effects
- Added `motion` (Framer Motion) for animations
- Added `canvas-confetti` for celebration effects
- Added `gsap` for timeline animations
- Updated all dependencies to latest stable versions

---

## [1.5.0] - 2025-11-15

### ✨ Added
- **Spotify Integration**: Embedded playlist player
- **Social Media Links**: GitHub, LinkedIn, X, Email icons
- **Custom Icons**: SVG icon components
- **Tooltip Component**: Hover-based tooltips
- **Responsive Design**: Mobile-first approach
- **Analytics**: Vercel Analytics integration

### 🔄 Changed
- Improved mobile responsiveness
- Enhanced color scheme
- Updated typography scale
- Refined spacing system

### 🐛 Fixed
- Safari-specific CSS bugs
- Mobile menu transitions
- Image loading optimization
- Font loading flash

---

## [1.0.0] - 2025-10-01

### ✨ Added
- **Initial Release**: Basic portfolio structure
- **Home Page**: Profile, About, Projects, Experience sections
- **Links Page**: Centralized link hub
- **Dark Mode**: Basic theme toggle
- **Next.js 15**: Initial setup with App Router
- **TailwindCSS 3**: Styling framework
- **TypeScript**: Type-safe development
- **ESLint**: Code linting

### 📝 Project Setup
- Git repository initialization
- Package.json configuration
- TypeScript configuration
- ESLint and Prettier setup
- Basic folder structure

---

## [0.1.0] - 2025-09-15 (Beta)

### ✨ Added
- Project concept and planning
- Technology stack selection
- Design mockups
- Initial prototypes

---

## 📊 Version Statistics

| Version | Release Date | Lines of Code | Components | Features |
|---------|--------------|---------------|------------|----------|
| 2.0.0 | 2025-12-31 | ~3,500 | 25+ | AI Chat, Backgrounds, Animations |
| 1.5.0 | 2025-11-15 | ~2,000 | 15 | Spotify, Social Links |
| 1.0.0 | 2025-10-01 | ~1,200 | 10 | Basic Portfolio |
| 0.1.0 | 2025-09-15 | ~500 | 5 | Prototype |

---

## 🎯 Migration Guides

### Migrating from 1.x to 2.0

#### Breaking Changes

1. **API Response Format Changed**:
   ```typescript
   // Old (1.x)
   { message: "response text" }
   
   // New (2.0)
   { 
     message: "response text",
     usage: {
       prompt_tokens: 450,
       completion_tokens: 200,
       total_tokens: 650
     }
   }
   ```

2. **Environment Variables**:
   ```bash
   # New required variable
   GROQ_API_KEY=your_key_here
   ```

3. **Theme System**:
   ```typescript
   // Old
   const { theme } = useTheme(); // returns "light" | "dark"
   
   // New
   const { theme, resolvedTheme } = useTheme();
   // theme: "light" | "dark" | "system"
   // resolvedTheme: "light" | "dark" (computed)
   ```

#### Update Steps

1. **Update Dependencies**:
   ```bash
   npm install
   ```

2. **Update Environment Variables**:
   ```bash
   # Add to .env.local
   GROQ_API_KEY=your_groq_api_key
   ```

3. **Update Next.js Config**:
   ```javascript
   // next.config.mjs
   const nextConfig = {
     output: "export", // Required for static export
   };
   ```

4. **Rebuild Project**:
   ```bash
   npm run build
   ```

---

## 🐛 Known Issues

### Current Version (2.0.0)

1. **GitHub API Rate Limiting**:
   - **Issue**: Contribution graph may fail to load after 60 requests/hour
   - **Workaround**: Will automatically retry after rate limit resets
   - **Status**: Considering GitHub token authentication

2. **Safari Theme Flash**:
   - **Issue**: Brief flash of light theme on page load in Safari
   - **Workaround**: Already minimized with localStorage check
   - **Status**: Working on further optimization

3. **Mobile Landscape Orientation**:
   - **Issue**: Some animations may be cut off in landscape mode
   - **Workaround**: Portrait mode recommended for best experience
   - **Status**: Planned fix in 2.0.1

### Resolved Issues

✅ **Canvas Performance** (Fixed in 2.0.0):
- Optimized dot grid rendering
- Reduced particle count on mobile
- Implemented RequestAnimationFrame

✅ **Hydration Errors** (Fixed in 2.0.0):
- Fixed theme provider hydration
- Resolved client/server mismatch
- Added proper SSR handling

---

## 🔮 Roadmap

### Version 2.1.0 (Q1 2026)
- [ ] Blog section with MDX
- [ ] Advanced search functionality
- [ ] Project filtering and sorting
- [ ] Enhanced analytics dashboard
- [ ] Performance optimizations

### Version 2.2.0 (Q2 2026)
- [ ] Contact form with validation
- [ ] Newsletter integration
- [ ] Comments system
- [ ] Social sharing features
- [ ] RSS feed

### Version 3.0.0 (Q3 2026)
- [ ] CMS integration (Sanity/Contentful)
- [ ] Multi-language support (i18n)
- [ ] Advanced SEO features
- [ ] PWA capabilities
- [ ] Offline support

---

## 📈 Performance Improvements

### Version 2.0.0
- **Lighthouse Score**: 95+ → 98+
- **First Load JS**: 220KB → 180KB
- **LCP**: 2.1s → 1.4s
- **CLS**: 0.05 → 0.02
- **Bundle Size**: Reduced by 18%

### Version 1.5.0
- **Lighthouse Score**: 90+ → 95+
- **Image Optimization**: WebP format adoption
- **Code Splitting**: Implemented dynamic imports
- **CSS Purging**: Removed unused Tailwind classes

---

## 🎨 Design Changes

### Version 2.0.0
- **New Color Palette**: Enhanced teal/orange accent colors
- **Typography**: Upgraded to Geist Sans/Mono fonts
- **Spacing**: Refined spacing scale
- **Animations**: Added 5 custom animation variants
- **Components**: Redesigned AI chat interface

### Version 1.5.0
- **Dark Mode**: Improved contrast ratios
- **Mobile UI**: Enhanced touch targets
- **Icons**: Custom SVG icon set
- **Cards**: Glassmorphism effects

---

## 🔧 Technical Changes

### Version 2.0.0

#### Build System
- Next.js 16 with Turbopack
- Static export mode
- Optimized bundle splitting
- ESM module support

#### Dependencies
```json
{
  "next": "16.1.1",
  "react": "19.2.3",
  "typescript": "5.x",
  "@tailwindcss/postcss": "^4.0.1",
  "motion": "^12.23.26",
  "three": "^0.182.0",
  "groq-sdk": "^0.9.0"
}
```

#### Configuration
- TypeScript strict mode enabled
- ESLint with Next.js rules
- Tailwind CSS v4 configuration
- Static export optimization

---

## 📝 Documentation Updates

### Version 2.0.0
- ✅ README.md: Expanded to 1,158+ lines
- ✅ CONTRIBUTING.md: Added comprehensive guidelines
- ✅ CHANGELOG.md: Version history tracking
- ✅ API.md: Detailed API documentation
- ✅ Code Comments: JSDoc for all major functions

### Version 1.5.0
- ✅ README.md: Initial comprehensive documentation
- ✅ Setup Guide: Installation and deployment
- ✅ Component Docs: Basic component documentation

---

## 🙏 Contributors

### Version 2.0.0
- **Aditya Kumar Tiwari** ([@Xenonesis](https://github.com/Xenonesis))
  - AI chat assistant implementation
  - Background system development
  - Animation framework
  - Documentation overhaul

### Version 1.x
- **Aditya Kumar Tiwari** ([@Xenonesis](https://github.com/Xenonesis))
  - Initial project setup
  - Core features implementation
  - Design and styling

---

## 📊 Project Metrics

### Code Statistics (2.0.0)
```
Total Lines of Code:    ~3,500
TypeScript Files:       25
React Components:       25+
API Routes:            1
Utilities:             5
Total Tests:           0 (planned)
Documentation Lines:   4,500+
```

### Component Breakdown
```
AIAssistant.tsx:             794 lines
DotGrid.tsx:                 423 lines
Particles.tsx:               261 lines
page.tsx (Home):             ~600 lines
GitHubContributions.tsx:     ~200 lines
AnimateIn.tsx:               106 lines
ThemeProvider.tsx:           ~150 lines
Other components:            ~966 lines
```

---

## 🔗 Release Links

- **Latest Release**: [v2.0.0](https://github.com/Xenonesis/portfolio/releases/tag/v2.0.0)
- **All Releases**: [GitHub Releases](https://github.com/Xenonesis/portfolio/releases)
- **Live Demo**: [iaddy.netlify.app](https://iaddy.netlify.app)

---

## 📅 Release Schedule

- **Major Releases**: Every 6 months
- **Minor Releases**: Every 2 months
- **Patch Releases**: As needed
- **Security Updates**: Immediate

---

## 💬 Feedback

We welcome feedback on all releases! Please:

- 🐛 [Report bugs](https://github.com/Xenonesis/portfolio/issues/new?labels=bug)
- 💡 [Request features](https://github.com/Xenonesis/portfolio/issues/new?labels=enhancement)
- 💬 [Start discussions](https://github.com/Xenonesis/portfolio/discussions)
- ⭐ [Star the repo](https://github.com/Xenonesis/portfolio)

---

<div align="center">

**[⬆ Back to Top](#-changelog)**

---

*For detailed commit history, see [GitHub Commits](https://github.com/Xenonesis/portfolio/commits/main)*

*Last Updated: December 31, 2025*

</div>
