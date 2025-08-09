# Reddit Product Advisor 🔍

A modern, AI-powered product recommendation application that analyzes Reddit discussions to provide intelligent product suggestions based on real user experiences.

## ✨ Features

- **AI-Powered Analysis**: Leverages Reddit discussions to find the best product recommendations
- **Modern UI/UX**: Clean, responsive design with smooth animations and transitions
- **Multi-language Support**: Full internationalization (English/Hungarian)
- **Theme System**: Light, dark, and auto theme switching
- **Layout Options**: Grid and list view modes for search results
- **Search History**: Persistent search history with easy management
- **Live Statistics**: Real-time display of platform statistics
- **Responsive Design**: Optimized for all device sizes

## 🛠️ Technology Stack

- **Framework**: Nuxt 3 with TypeScript
- **State Management**: Pinia
- **Styling**: SCSS with modern design tokens
- **UI Components**: Custom Vue 3 components with Composition API
- **Internationalization**: Vue I18n
- **Development**: Vite with hot module replacement

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reddites
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
app/
├── assets/scss/          # Design system and global styles
│   ├── main.scss        # Main stylesheet
│   ├── tokens.scss      # Design tokens (colors, spacing, typography)
│   └── components.scss  # Component styles
├── components/          # Reusable Vue components
│   ├── LanguageSwitcher.vue
│   ├── ProductCard.vue
│   ├── ThemeToggle.vue
│   ├── SearchHistory.vue
│   └── StatsSection.vue
├── layouts/            # Layout components
│   └── default.vue
├── locales/           # Internationalization files
│   ├── en.json        # English translations
│   └── hu.json        # Hungarian translations
├── pages/             # Application pages
│   └── index.vue
├── stores/            # Pinia stores
│   ├── searchStore.ts # Search functionality
│   └── uiStore.ts     # UI state and preferences
└── utils/             # Utility functions
    └── discordLogger.ts

shared/
└── types/             # TypeScript type definitions
    └── index.ts

server/
└── api/               # API endpoints
    └── search.ts      # Search API with AI integration
```

## 🎨 Design System

The application features a comprehensive design system with:

- **CSS Custom Properties**: For consistent theming
- **Design Tokens**: Standardized spacing, colors, and typography
- **Component Library**: Reusable styled components
- **Responsive Grid**: Mobile-first responsive design
- **Accessibility**: WCAG compliant color contrasts and keyboard navigation

## 🌍 Internationalization

Full support for multiple languages:
- English (en)
- Hungarian (hu)

Easily extendable to support additional languages by adding new locale files.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

### API Configuration

The application uses OpenRouter for AI-powered product analysis. Configure your API key in the environment variables.

## 📱 Features Overview

### Search & Discovery
- Intelligent product search using Reddit discussions
- Search suggestions and history
- Advanced filtering and sorting options

### User Experience
- Modern, intuitive interface
- Smooth animations and micro-interactions
- Theme switching (light/dark/auto)
- Layout preferences (grid/list)
- Persistent user preferences

### Product Analysis
- AI-powered recommendation engine
- Confidence scoring for recommendations
- Category-based organization
- Real user experience insights

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

The application is optimized for deployment on Vercel:

```bash
npm run build
# Deploy the .output directory
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Reddit API for discussion data
- OpenRouter for AI capabilities
- Vue.js ecosystem for the excellent developer experience
- Community contributors and testers

---

**Built with ❤️ using modern web technologies**