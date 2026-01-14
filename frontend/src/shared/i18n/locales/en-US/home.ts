/**
 * Home page translations - English
 *
 * Namespace: home (feature module)
 * Usage: useTranslation('home') then t('homePage.welcome.title')
 *
 * Industry standard: Group by feature modules, page content uses [pageName]Page keys
 */
export default {
  // Home page content
  homePage: {
    welcome: {
      title: 'Welcome to Frontend Template',
      description:
        'An enterprise-grade frontend template based on FSD architecture, optimized for AI programming tools.',
    },
    features: {
      fsdArchitecture: {
        title: 'FSD Architecture',
        description:
          'Organize code by feature modules with clear boundaries, making it easier for AI to understand',
      },
      aiFriendly: {
        title: 'AI Friendly',
        description: 'Includes Cursor/Copilot configuration and workflow templates',
      },
      modernStack: {
        title: 'Modern Tech Stack',
        description: 'React 19 + Vite + TypeScript + Tailwind CSS',
      },
      authSystem: {
        title: 'Authentication System',
        description: 'Complete login authentication flow with Zustand state management',
      },
      codeSplitting: {
        title: 'Code Splitting',
        description: 'Route-level lazy loading for optimized first-screen load speed',
      },
      documentation: {
        title: 'Documentation',
        description: 'Detailed development guidelines and code templates',
      },
    },
  },
} as const
