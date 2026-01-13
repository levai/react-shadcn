# GitHub Copilot Instructions

This is an enterprise frontend template project using **Feature-Sliced Design (FSD)** architecture, optimized for AI-assisted development.

> 📖 **详细规范**: 完整规范请查看 [`docs/rules/ai-instructions.md`](../docs/rules/ai-instructions.md)

## Technology Stack

- React 19 + TypeScript 5.9
- Vite 7 + Tailwind CSS 4
- Zustand (state management)
- React Router 7 (routing)
- Axios (HTTP client)
- react-i18next (internationalization)
- ahooks (Hooks library)
- sonner (Toast notifications)
- lucide-react (Icon library)

## Directory Structure

```
src/
├── app/              # Application layer: entry, providers, layouts
├── features/         # Feature layer: business features
│   └── [feature]/
│       ├── ui/       # UI components
│       ├── api/      # API services
│       ├── model/    # State (Zustand stores)
│       └── index.ts  # Public API (unified export)
├── pages/            # Page layer: route entry components
├── shared/           # Shared layer: utilities, types, config
└── routes/           # Route configuration
```

## Core Rules

### Path Alias

**Always use `@/` prefix, never use relative imports:**

```typescript
// ✅ Correct
import { LoginForm } from '@/features/auth'
import { cn } from '@/shared/lib'

// ❌ Wrong
import { LoginForm } from '../../features/auth'
```

### Import Rules

1. **Import from feature's `index.ts`** - Never import internal files directly
2. **Use named imports** - Avoid `import *`
3. **Shared hooks from `@/shared/hooks`**

```typescript
// ✅ Correct
import { LoginForm, useAuthStore, authService } from '@/features/auth'
import { useRequest } from '@/shared/hooks'

// ❌ Wrong
import { LoginForm } from '@/features/auth/ui/LoginForm'
```

### Component Patterns

**Page components:**
```typescript
const LoginPage = () => {
  const { t } = useTranslation('auth')
  return <div>{t('loginPage.title')}</div>
}
export default LoginPage
```

**Feature components:**
```typescript
export function LoginForm({ onSubmit }: Props) {
  return <form>...</form>
}
```

### Data Fetching

**Always use `useRequest` hook:**

```typescript
import { useRequest } from '@/shared/hooks'

const { data, loading, error } = useRequest(
  () => userService.getUser(userId),
  { refreshDeps: [userId] }
)
```

### Internationalization

**Always use i18n, never hardcode text:**

```typescript
import { useTranslation } from '@/shared/i18n'

const { t } = useTranslation('common')
return <div>{t('actions.confirm')}</div>
```

### Routing

**Use ROUTES constants, never hardcode paths:**

```typescript
import { ROUTES } from '@/shared/constants'
navigate(ROUTES.HOME)  // ✅ Correct
navigate('/')           // ❌ Wrong
```

### Styling

**Use `cn()` utility:**
```typescript
import { cn } from '@/shared/lib'
<div className={cn('base', isActive && 'active')} />
```

**Use CSS variables, never hardcode colors:**
```typescript
className="bg-primary text-primary-foreground"  // ✅ Correct
className="bg-[#05C79A]"                        // ❌ Wrong
```

### Icons and Notifications

- Icons: `lucide-react`
- Toast: `sonner`

```typescript
import { Home } from 'lucide-react'
import { toast } from 'sonner'

<Home className="h-5 w-5" />
toast.success('Operation successful')
```

## Key Rules Summary

1. ✅ Use `@/` path alias
2. ✅ Import from feature's `index.ts`
3. ✅ Use `cn()` for class names
4. ✅ Use TypeScript types
5. ✅ Always use i18n
6. ✅ Use `useRequest` for data fetching
7. ✅ Use ROUTES constants
8. ✅ Use toast (sonner)
9. ✅ Use lucide-react icons
10. ✅ Follow FSD architecture

## Documentation

For detailed specifications with code examples and complete documentation links, refer to:
- **[AI Instructions (Unified)](../docs/rules/ai-instructions.md)** - Complete rules, examples, and all documentation links (**Single source of truth**)
