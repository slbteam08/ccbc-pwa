# Church PWA

A Progressive Web Application (PWA) built for church communities to stay connected. This project demonstrates modern web development practices using React, TypeScript, RTK Query, and PWA capabilities.

## 🚀 Features

- **Progressive Web App (PWA)**: Installable on mobile and desktop devices
- **Offline Support**: Works offline with service worker caching
- **Real-time API Integration**: Uses RTK Query for efficient data fetching and caching
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **TypeScript**: Full type safety throughout the application
- **Online/Offline Status**: Visual indicator of connection status
- **Church-themed Interface**: Designed specifically for church communities

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (RTK)
- **API Layer**: RTK Query
- **PWA**: Vite PWA Plugin with Workbox
- **Styling**: Tailwind CSS utility-first framework
- **Icons**: SVG-based PWA icons

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── store/
│   ├── index.ts          # Redux store configuration
│   ├── apiSlice.ts       # RTK Query API slice
│   └── hooks.ts          # Typed Redux hooks
├── App.tsx               # Main application component
├── App.css               # Application styles
├── main.tsx              # Application entry point
└── index.css             # Global styles

public/
├── pwa-192x192.png       # PWA icon (192x192)
├── pwa-512x512.png       # PWA icon (512x512)
└── manifest.json         # PWA manifest (auto-generated)
```

## 🔧 Configuration

### PWA Configuration
The PWA is configured in `vite.config.ts` with:
- Auto-update registration
- Custom manifest with church branding
- Workbox for offline caching
- Service worker for background sync

### RTK Query Setup
API configuration is in `src/store/apiSlice.ts`:
- Base URL configuration
- Default headers
- Cache tag types for invalidation
- Example health check endpoint

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Capable**: Cached resources work without internet
- **App-like Experience**: Standalone display mode
- **Fast Loading**: Service worker caching for instant loads
- **Background Sync**: Updates when connection is restored

## 🎨 UI Features

- **Modern Design**: Glass-morphism effects with backdrop blur using Tailwind CSS
- **Responsive Layout**: Grid-based responsive design with Tailwind utilities
- **Smooth Animations**: CSS transitions and keyframe animations
- **Status Indicators**: Visual online/offline status
- **Church Theming**: Purple gradient with church-appropriate colors
- **Utility-First Styling**: Beautiful gradient backgrounds and modern styling with Tailwind

## 🚀 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory with:
- Minified and bundled assets
- Service worker for PWA functionality
- Optimized images and icons
- Manifest file for app installation

## 🔄 Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📋 Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with PWA support

---

**Built with ❤️ for church communities**
