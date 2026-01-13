# 国际化集成说明

## 安装依赖

项目使用 **react-i18next** 作为国际化解决方案。请先安装依赖：

```bash
npm install i18next react-i18next i18next-browser-languagedetector
# 或
pnpm add i18next react-i18next i18next-browser-languagedetector
# 或
yarn add i18next react-i18next i18next-browser-languagedetector
```

## 已集成的功能

✅ **i18n 配置** - 完整的 i18next 配置  
✅ **语言资源** - 中文（zh-CN）和英文（en-US）语言包  
✅ **I18nProvider** - 国际化 Provider 组件  
✅ **语言切换组件** - `LanguageToggle` 组件  
✅ **自动语言检测** - 自动检测浏览器语言和用户偏好  
✅ **本地存储** - 用户选择的语言保存在 localStorage  
✅ **VSCode 插件支持** - i18n Ally 插件配置，支持内联翻译提示  

## 目录结构

```
src/shared/i18n/
├── config.ts              # i18n 配置
├── index.ts               # 统一导出
└── locales/              # 语言资源文件
    ├── zh-CN/            # 简体中文
    │   ├── common.ts     # 通用翻译
    │   ├── auth.ts       # 认证相关
    │   ├── layout.ts     # 布局相关
    │   └── index.ts
    └── en-US/            # 英语
        ├── common.ts
        ├── auth.ts
        ├── layout.ts
        └── index.ts
```

## 快速使用

### 在组件中使用

#### 单个命名空间

```typescript
import { useTranslation } from '@/shared/i18n'

function MyComponent() {
  const { t } = useTranslation('common')
  
  return (
    <div>
      {/* 使用嵌套结构的键（点号分隔） */}
      <button>{t('actions.confirm')}</button>
      <button>{t('actions.cancel')}</button>
      <div>{t('status.loading')}</div>
    </div>
  )
}
```

#### 多个命名空间（推荐）

当一个组件需要使用多个模块的翻译时：

```typescript
import { useTranslation } from '@/shared/i18n'

function Header() {
  // 加载多个命名空间：layout 作为默认，auth 作为辅助
  const { t } = useTranslation(['layout', 'auth'])
  
  return (
    <div>
      {/* 默认命名空间（layout）的键，支持嵌套结构 */}
      {t('nav.home')}
      {t('nav.dashboard')}
      
      {/* 其他命名空间的键使用 namespace:key 格式，支持嵌套结构 */}
      {t('auth:login')}
      {t('auth:messages.loginSuccess')}
    </div>
  )
}
```

#### 嵌套结构说明

所有翻译资源使用嵌套结构，按功能分组：

- **common**: `actions.*`、`status.*`、`messages.*`、`validation.*`、`pagination.*`
- **auth**: `form.*`、`loginPage.*`、`messages.*`
- **layout**: `nav.*`、`theme.*`、`language.*`、`sidebar.*`
- **home**: `homePage.*`（功能模块，页面内容使用 `[pageName]Page` 键）

**使用方式：** `t('actions.confirm')`、`t('form.email')`、`t('nav.home')`、`t('homePage.welcome.title')`

### 使用语言切换组件

```typescript
import { LanguageToggle } from '@/shared/ui'

function Header() {
  return (
    <header>
      <LanguageToggle />
    </header>
  )
}
```

## 已应用国际化的组件

- ✅ `Header` - 头部组件
- ✅ `LoginForm` - 登录表单

## 添加新翻译

### 1. 在现有命名空间中添加

编辑对应的语言资源文件：

```typescript
// src/shared/i18n/locales/zh-CN/common.ts
export default {
  // ... 现有翻译
  newKey: '新翻译',
}
```

```typescript
// src/shared/i18n/locales/en-US/common.ts
export default {
  // ... existing translations
  newKey: 'New Translation',
}
```

### 2. 创建新的命名空间

1. 创建语言资源文件（如 `user.ts`）
2. 更新 `locales/[lang]/index.ts`
3. 更新 `config.ts` 中的 `ns` 和 `resources`

详细步骤请查看：[国际化规范](./docs/rules/i18n.md)

## 支持的语言

- **zh-CN**: 简体中文（默认）
- **en-US**: 英语

## 语言检测顺序

1. **localStorage** - 用户之前的选择（`i18nextLng`）
2. **navigator** - 浏览器语言设置
3. **fallback** - 默认语言 `zh-CN`

## VSCode 插件支持

项目已配置 **i18n Ally** 插件（`.vscode/settings.json`），支持：

- ✅ 内联翻译提示（在代码中显示中文）
- ✅ 悬浮窗显示翻译内容
- ✅ 缺失翻译键警告
- ✅ 快速跳转到翻译文件

**关键配置：**
- `enabledParsers`: `["ts", "tsx"]` - 支持 TypeScript 和 TSX 文件
- `enabledFrameworks`: `["react", "react-i18next"]` - 启用框架支持
- `pathMatcher`: `"{locale}/{namespace}.ts"` - 匹配文件路径格式

## 注意事项

1. **初始化**: i18n 在 `main.tsx` 中自动初始化
2. **Provider 顺序**: `I18nProvider` 已在 `Providers` 中正确配置
3. **VSCode 插件**: 确保安装了 `i18n Ally` 插件（`lokalise.i18n-ally`）
3. **类型安全**: 建议使用 TypeScript 确保翻译键的正确性

## 更多信息

详细使用指南请查看：[国际化规范文档](./docs/rules/i18n.md)
