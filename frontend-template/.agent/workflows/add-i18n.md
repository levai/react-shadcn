---
description: 国际化工作流 - 添加新语言和命名空间
---

# 国际化工作流

## 添加新语言

### 步骤

#### 1. 创建语言资源文件

在 `src/shared/i18n/locales/[lang]/` 下创建对应的命名空间文件：

```bash
mkdir -p src/shared/i18n/locales/fr-FR
```

创建所有必需的命名空间文件（参考现有 `zh-CN` 和 `en-US` 的结构）：

```typescript
// src/shared/i18n/locales/fr-FR/common.ts
export default {
  actions: {
    confirm: 'Confirmer',
    cancel: 'Annuler',
    // ... 参考 zh-CN/common.ts 和 en-US/common.ts 的结构
  },
  status: {
    loading: 'Chargement...',
    success: 'Succès',
    // ...
  },
  // ...
} as const
```

```typescript
// src/shared/i18n/locales/fr-FR/auth.ts
export default {
  login: 'Connexion',
  logout: 'Déconnexion',
  form: {
    email: 'Email',
    password: 'Mot de passe',
    // ... 参考现有结构
  },
  // ...
} as const
```

```typescript
// src/shared/i18n/locales/fr-FR/layout.ts
export default {
  nav: {
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    // ... 参考现有结构
  },
  // ...
} as const
```

```typescript
// src/shared/i18n/locales/fr-FR/index.ts
import common from './common'
import auth from './auth'
import layout from './layout'

export default {
  common,
  auth,
  layout,
}
```

**注意：** 新语言的翻译文件结构必须与 `zh-CN` 和 `en-US` 完全一致，确保所有键都存在。

#### 2. 更新 i18n 配置

在 `src/shared/i18n/config.ts` 中：

```typescript
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'
import frFR from './locales/fr-FR'  // 新增

i18n.init({
  // 添加到支持的语言列表
  supportedLngs: ['zh-CN', 'en-US', 'fr-FR'],  // 新增 fr-FR
  
  // 添加到资源
  resources: {
    'zh-CN': {
      common: zhCN.common,
      auth: zhCN.auth,
      layout: zhCN.layout,
    },
    'en-US': {
      common: enUS.common,
      auth: enUS.auth,
      layout: enUS.layout,
    },
    'fr-FR': {  // 新增
      common: frFR.common,
      auth: frFR.auth,
      layout: frFR.layout,
    },
  },
})
```

#### 3. 更新类型定义

在 `src/shared/i18n/types.d.ts` 中：

```typescript
import commonZhCN from './locales/zh-CN/common'
import authZhCN from './locales/zh-CN/auth'
import layoutZhCN from './locales/zh-CN/layout'
// 注意：类型定义使用中文资源作为类型源即可，不需要导入所有语言

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof commonZhCN
      auth: typeof authZhCN
      layout: typeof layoutZhCN
    }
  }
}
```

**注意：** 类型定义只需要一个语言的资源作为类型源即可（通常使用默认语言）。

#### 4. 更新语言切换组件

在 `src/shared/ui/LanguageToggle.tsx` 中添加新语言选项：

```typescript
const languages = [
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },  // 新增
]
```

## 添加新的命名空间

### 步骤

#### 1. 创建命名空间文件

在所有语言目录下创建新的命名空间文件：

```typescript
// src/shared/i18n/locales/zh-CN/user.ts
export default {
  profile: {
    title: '个人资料',
    edit: '编辑资料',
  },
  settings: {
    title: '设置',
    changePassword: '修改密码',
  },
} as const
```

```typescript
// src/shared/i18n/locales/en-US/user.ts
export default {
  profile: {
    title: 'Profile',
    edit: 'Edit Profile',
  },
  settings: {
    title: 'Settings',
    changePassword: 'Change Password',
  },
} as const
```

#### 2. 更新语言包索引

在所有语言的 `index.ts` 中添加新命名空间：

```typescript
// src/shared/i18n/locales/zh-CN/index.ts
import common from './common'
import auth from './auth'
import layout from './layout'
import user from './user'  // 新增

export default {
  common,
  auth,
  layout,
  user,  // 新增
}
```

#### 3. 更新 i18n 配置

在 `src/shared/i18n/config.ts` 中：

```typescript
i18n.init({
  // 添加到命名空间列表
  ns: ['common', 'auth', 'layout', 'user'],  // 新增 user
  
  // 添加到所有语言的资源
  resources: {
    'zh-CN': {
      common: zhCN.common,
      auth: zhCN.auth,
      layout: zhCN.layout,
      user: zhCN.user,  // 新增
    },
    'en-US': {
      common: enUS.common,
      auth: enUS.auth,
      layout: enUS.layout,
      user: enUS.user,  // 新增
    },
  },
})
```

#### 4. 更新类型定义

在 `src/shared/i18n/types.d.ts` 中：

```typescript
import userZhCN from './locales/zh-CN/user'  // 新增

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof commonZhCN
      auth: typeof authZhCN
      layout: typeof layoutZhCN
      user: typeof userZhCN  // 新增
    }
  }
}
```

#### 5. 在组件中使用

```typescript
import { useTranslation } from '@/shared/i18n'

function UserProfile() {
  const { t } = useTranslation('user')
  
  return (
    <div>
      <h1>{t('profile.title')}</h1>
      <button>{t('profile.edit')}</button>
    </div>
  )
}
```

## 在组件中使用国际化

### 步骤

#### 1. 导入 useTranslation

```typescript
import { useTranslation } from '@/shared/i18n'
```

#### 2. 选择命名空间

**单个命名空间：**
```typescript
const { t } = useTranslation('auth')
t('form.email')  // 使用嵌套结构的键
```

**多个命名空间：**
```typescript
const { t } = useTranslation(['layout', 'auth'])
t('nav.home')                    // layout 命名空间
t('auth:messages.loginSuccess')  // auth 命名空间
```

#### 3. 使用翻译键

```typescript
// 嵌套结构的键使用点号分隔
t('actions.confirm')
t('form.email')
t('nav.dashboard')

// 跨命名空间使用 namespace:key 格式
t('common:status.loading')
t('auth:messages.loginSuccess')
```

#### 4. 插值

```typescript
// 语言资源：pagination.total: '共 {{total}} 条'
t('pagination.total', { total: 100 })  // 输出：共 100 条
```

## 翻译资源结构规范

### 嵌套结构组织

所有翻译资源使用**嵌套结构**，按功能分组：

**common.ts:**
```typescript
{
  actions: { ... },      // 操作按钮
  status: { ... },      // 状态
  messages: { ... },     // 消息提示
  validation: { ... },   // 表单验证
  pagination: { ... },   // 分页
  time: { ... },        // 时间相关
}
```

**auth.ts:**
```typescript
{
  form: { ... },        // 表单字段
  loginPage: { ... },   // 登录页面
  messages: { ... },     // 认证消息
}
```

**layout.ts:**
```typescript
{
  nav: { ... },         // 导航菜单
  theme: { ... },      // 主题设置
  language: { ... },    // 语言设置
  sidebar: { ... },    // 侧边栏
}
```

## 注意事项

1. **保持结构一致** - 所有语言的同名命名空间必须结构一致
2. **使用 `as const`** - 确保类型推断准确
3. **嵌套深度** - 建议不超过 3 层（如 `nav.home`、`form.email.label`）
4. **键名规范** - 使用 camelCase，语义清晰
5. **类型安全** - 添加新命名空间后记得更新 `types.d.ts`

## 完整示例

### 添加新语言支持（示例：法语）

1. 创建 `src/shared/i18n/locales/fr-FR/` 目录和所有命名空间文件（参考 `zh-CN` 和 `en-US` 的结构）
2. 更新 `config.ts` 添加 `fr-FR` 到 `supportedLngs` 和 `resources`
3. 更新 `LanguageToggle.tsx` 添加新语言选项

**重要：** 确保新语言的所有命名空间文件结构完全一致，所有翻译键都存在。

### 添加用户模块命名空间

1. 创建 `src/shared/i18n/locales/[lang]/user.ts`（所有语言）
2. 更新所有语言的 `index.ts`
3. 更新 `config.ts` 添加 `user` 到 `ns` 和 `resources`
4. 更新 `types.d.ts` 添加类型定义
