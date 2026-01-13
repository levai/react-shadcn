# GitHub Copilot Instructions

This is an enterprise frontend template project using Feature-Sliced Design (FSD) architecture, optimized for AI-assisted development.

## Technology Stack

- React 19 + TypeScript 5.9
- Vite 7 + Tailwind CSS 4
- Zustand (state management)
- React Router 7 (routing)
- Axios (HTTP client)

## Directory Structure

```
src/
├── app/              # Application layer: entry, providers
├── features/         # Feature layer: business features
│   └── [feature]/
│       ├── ui/       # Components
│       ├── api/      # API services
│       ├── model/    # State (zustand stores)
│       └── index.ts  # Public API
├── pages/            # Page layer: route entries
├── shared/           # Shared layer: utilities, types, config
└── routes/           # Route configuration
```

## Coding Conventions

1. **Use `@/` path alias** - Never use relative imports
2. **Import from feature's index.ts** - Don't import internal files
3. **Use `cn()` for class names** - Never concatenate strings
4. **Use TypeScript types** - Define interfaces for all data

## Component Patterns

```typescript
// Page component: arrow function + default export
const ExamplePage = () => {
  return <div>...</div>
}
export default ExamplePage

// Feature component: function declaration + named export
export function ExampleComponent({ prop }: Props) {
  return <div>...</div>
}
```

## API Service Pattern

```typescript
const API = {
  ENDPOINT: '/v1/resource',
} as const

const service = {
  fetch: async (): Promise<Data> => {
    return request<Data>(API.ENDPOINT)
  },
}

export default service
```

## State Management Pattern (Zustand)

```typescript
import { create } from 'zustand'

interface State {
  data: Data | null
  setData: (data: Data) => void
}

export const useStore = create<State>(set => ({
  data: null,
  setData: data => set({ data }),
}))
```

## Key Rules

- Always use ROUTES constants for navigation
- Wrap protected routes with ProtectedRoute
- Use lazy() for page components
- Use toast from sonner for notifications
- Use lucide-react for icons
