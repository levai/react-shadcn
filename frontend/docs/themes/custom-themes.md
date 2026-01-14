# 自定义主题配置指南

## 📚 概述

项目支持自定义主题色，可以通过 CSS 变量轻松创建新的主题。

**架构说明：**
- 主题配置已集中化管理，所有主题元数据统一在 `src/shared/config/themes.ts` 中定义
- `ThemeToggle` 组件自动从配置中心读取主题列表，无需手动维护
- 按钮图标会根据当前主题自动更新，显示对应主题的图标

## 🎨 主题系统

### 当前支持的主题

1. **light** - 浅色模式
2. **dark** - 深色模式
3. **system** - 跟随系统设置
4. **theme-blue** - 蓝色主题（示例）

### 主题切换

主题切换通过 `ThemeToggle` 组件实现，用户可以在所有可用主题之间切换。按钮图标会根据当前选中的主题自动更新。

## 🔧 如何创建自定义主题

### 步骤 1: 在 `globals.css` 中添加主题 CSS 变量

```css
/* 自定义主题 - 绿色主题 */
.theme-green {
  /* 基础色 */
  --background: 142 30% 98%; /* 浅绿灰背景 */
  --foreground: 142 30% 15%; /* 深绿灰文本 */

  /* 卡片和弹出层 */
  --card: 142 25% 100%; /* 白色卡片 */
  --card-foreground: 142 30% 15%; /* 深绿灰文本 */
  --popover: 142 25% 100%; /* 白色弹出层 */
  --popover-foreground: 142 30% 15%; /* 深绿灰文本 */

  /* 主色 - 绿色 */
  --primary: 142 76% 36%; /* #10B981 */
  --primary-foreground: 0 0% 100%; /* 白色 */

  /* 次要色 */
  --secondary: 142 30% 95%; /* 浅绿色背景 */
  --secondary-foreground: 142 76% 30%; /* 深绿色 */

  /* 静音色 */
  --muted: 142 15% 96%; /* 浅灰 */
  --muted-foreground: 142 10% 50%; /* 中灰色文本 */

  /* 强调色 */
  --accent: 142 30% 95%; /* 浅绿色背景 */
  --accent-foreground: 142 76% 30%; /* 深绿色 */

  /* 危险色 */
  --destructive: 0 84% 60%; /* #EF4444 */
  --destructive-foreground: 0 0% 100%; /* 白色 */

  /* 边框和输入 */
  --border: 142 20% 90%; /* 浅色边框 */
  --input: 142 20% 90%; /* 浅色输入框边框 */
  --ring: 142 76% 36%; /* 绿色 */
}
```

**注意：** 不再需要手动定义 `--ant-color-*` 变量，Ant Design 会自动从基础 CSS 变量生成。

````

### 步骤 2: 在主题配置中心添加主题配置

在 `src/shared/config/themes.ts` 的 `THEMES` 数组中添加新主题：

```typescript
import { Leaf } from 'lucide-react'

export const THEMES: ThemeConfig[] = [
  // ... 现有主题
  {
    id: 'theme-green',
    label: '绿色主题',
    icon: Leaf,
    isDark: false, // 根据主题背景色设置
  },
]
````

**说明：**

- `id`: 主题 ID，对应 CSS class 名称（如 `.theme-green`）
- `label`: 显示名称，会显示在下拉菜单中
- `icon`: 图标组件（使用 `lucide-react`），会显示在按钮和菜单项中
- `isDark`: 是否为深色模式（用于 Ant Design 主题算法选择）

**变化说明：**
- ✅ **集中化配置**：所有主题配置统一在 `themes.ts` 中管理，不再分散在多个文件中
- ✅ **自动同步**：`ThemeProvider` 和 `ThemeToggle` 自动从配置中心读取，添加新主题后自动生效
- ✅ **图标自动更新**：按钮图标会根据当前主题自动显示对应的图标（如 `theme-blue` 显示 `Palette` 图标）

### 步骤 3: 自动生效

完成以上步骤后，新主题会自动：

- 出现在 `ThemeToggle` 的下拉菜单中
- 按钮图标会根据当前主题自动更新
- `ThemeProvider` 会自动识别新主题

## 🎨 颜色变量说明

### 基础颜色变量

| 变量名                 | 说明         | 示例值               |
| ---------------------- | ------------ | -------------------- |
| `--background`         | 页面背景色   | `0 0% 100%` (白色)   |
| `--foreground`         | 主要文本色   | `220 15% 20%` (深色) |
| `--card`               | 卡片背景色   | `0 0% 98%` (浅灰)    |
| `--card-foreground`    | 卡片文本色   | `220 15% 20%` (深色) |
| `--popover`            | 弹出层背景色 | `0 0% 100%` (白色)   |
| `--popover-foreground` | 弹出层文本色 | `220 15% 20%` (深色) |

### 主题色变量

| 变量名                     | 说明                   | 示例值                  |
| -------------------------- | ---------------------- | ----------------------- |
| `--primary`                | 主色（按钮、链接等）   | `165 95% 40%` (#05C79A) |
| `--primary-foreground`     | 主色上的文本色         | `0 0% 100%` (白色)      |
| `--secondary`              | 次要色                 | `165 95% 95%` (浅青绿)  |
| `--secondary-foreground`   | 次要色上的文本色       | `165 95% 25%` (#037d61) |
| `--muted`                  | 静音背景色             | `220 10% 96%` (浅灰)    |
| `--muted-foreground`       | 静音文本色             | `220 10% 45%` (中灰)    |
| `--accent`                 | 强调色                 | `165 95% 95%` (浅青绿)  |
| `--accent-foreground`      | 强调色上的文本色       | `165 95% 25%` (#037d61) |
| `--destructive`            | 危险色（删除、错误等） | `0 100% 64%` (#FF4747)  |
| `--destructive-foreground` | 危险色上的文本色       | `0 0% 100%` (白色)      |

### 边框和输入变量

| 变量名     | 说明         | 示例值                   |
| ---------- | ------------ | ------------------------ |
| `--border` | 边框色       | `220 15% 85%` (浅色边框) |
| `--input`  | 输入框边框色 | `220 15% 85%` (浅色边框) |
| `--ring`   | 焦点环颜色   | `165 95% 40%` (#05C79A)  |

### 圆角变量

| 变量名     | 说明     | 示例值   |
| ---------- | -------- | -------- |
| `--radius` | 基础圆角 | `0.5rem` |

## 📝 HSL 颜色格式说明

所有颜色使用 HSL 格式（Hue Saturation Lightness）：

- **H (色相)**: 0-360 度
  - 0/360 = 红色
  - 120 = 绿色
  - 240 = 蓝色
- **S (饱和度)**: 0-100%
  - 0% = 灰色
  - 100% = 纯色
- **L (亮度)**: 0-100%
  - 0% = 黑色
  - 50% = 中等
  - 100% = 白色

示例：`165 95% 40%` = HSL(165°, 95%, 40%) = #05C79A

## 🎯 最佳实践

1. **保持对比度**：确保文本色和背景色有足够的对比度（WCAG AA 标准）
2. **统一色调**：使用相近的色相值，保持视觉一致性
3. **测试深色模式**：如果主题支持深色模式，确保深色版本也定义完整
4. **Ant Design 集成**：确保所有 `--ant-color-*` 变量都定义，以便 Ant Design 组件正确显示

## 🔍 颜色工具推荐

- [Coolors](https://coolors.co/) - 配色方案生成器
- [HSL Color Picker](https://hslpicker.com/) - HSL 颜色选择器
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - 对比度检查工具

## 📚 参考示例

查看以下文件作为参考：

- `src/app/globals.css` - CSS 变量定义
  - `:root` - 浅色模式
  - `.dark` - 深色模式
  - `.theme-blue` - 蓝色主题示例
- `src/shared/config/themes.ts` - 主题配置中心
- `src/shared/ui/ThemeToggle.tsx` - 主题切换组件实现

## 🎯 使用 ThemeToggle 组件

```typescript
import { ThemeToggle } from '@/shared/ui'

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  )
}
```

**组件特性：**

- 按钮图标会根据当前主题自动更新
- 下拉菜单显示所有可用主题
- 每个主题都有对应的图标和标签
