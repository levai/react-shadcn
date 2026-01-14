# Providers 说明

## AntDesignProvider

Ant Design Provider 已集成到项目中，主题会自动继承 Tailwind CSS 的颜色系统。

### 功能特性

1. **主题继承**：自动读取 Tailwind CSS 的 CSS 变量，包括：
   - 主色（primary）
   - 错误色（destructive）
   - 背景色、文本色、边框色等

2. **深色/浅色模式支持**：自动跟随 `next-themes` 的主题切换

3. **组件样式统一**：所有 Ant Design 组件的样式都会与 Tailwind CSS 保持一致

### 使用示例

```tsx
import { Button, Card, Input } from 'antd'

function MyComponent() {
  return (
    <Card title="示例卡片">
      <Input placeholder="输入内容" />
      <Button type="primary">主要按钮</Button>
      <Button type="default">默认按钮</Button>
      <Button danger>危险按钮</Button>
    </Card>
  )
}
```

### 主题配置

主题配置在 `AntDesignProvider.tsx` 中，会自动从以下 CSS 变量读取：

- `--primary`: 主色
- `--destructive`: 错误色
- `--background`: 背景色
- `--foreground`: 文本色
- `--border`: 边框色
- `--radius`: 圆角

### 注意事项

- Ant Design 组件会自动应用主题，无需额外配置
- 主题切换时会自动更新所有 Ant Design 组件
- 如果 CSS 变量未定义，会使用默认值
