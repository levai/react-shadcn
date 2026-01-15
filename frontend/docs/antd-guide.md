# Ant Design 使用指南

## 📚 概述

本项目**完全使用 Ant Design 作为主要 UI 组件库**，Tailwind CSS 仅用于布局和自定义样式补充。

## 🎯 核心原则

1. **优先使用 Ant Design 组件** - 能用 Ant Design 组件实现的，优先使用组件
2. **Tailwind CSS 作为补充** - 仅用于布局、间距、响应式等辅助样式
3. **保持一致性** - **所有 UI 组件统一使用 Ant Design 的设计语言** ⭐
4. **Toast 通知使用 sonner** - Toast 通知统一使用 `sonner` 的 `toast` API ⭐

## 📦 组件使用规范

### 布局组件

#### Row / Col（替代 Tailwind Grid）

```typescript
import { Row, Col } from 'antd'

// ✅ 正确 - 使用 Ant Design Grid
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} lg={8}>
    <Card>内容</Card>
  </Col>
</Row>

// ❌ 错误 - 不要使用 Tailwind Grid
<div className="grid grid-cols-3 gap-4">
  <div>内容</div>
</div>
```

#### Space（替代 flex gap）

```typescript
import { Space } from 'antd'

// ✅ 正确
<Space direction="vertical" size="large">
  <Button>按钮1</Button>
  <Button>按钮2</Button>
</Space>

// ❌ 错误
<div className="flex flex-col gap-4">
  <Button>按钮1</Button>
  <Button>按钮2</Button>
</div>
```

### 内容组件

#### Card（替代自定义 div）

```typescript
import { Card } from 'antd'

// ✅ 正确
<Card title="标题" hoverable>
  内容
</Card>

// ❌ 错误
<div className="p-6 bg-card rounded-lg border">
  内容
</div>
```

#### Typography（替代原生标题和段落）

```typescript
import { Typography } from 'antd'

const { Title, Paragraph, Text } = Typography

// ✅ 正确
<Title level={2}>标题</Title>
<Paragraph>段落内容</Paragraph>
<Text strong>强调文本</Text>

// ❌ 错误
<h2 className="text-2xl font-bold">标题</h2>
<p>段落内容</p>
```

### 反馈组件

#### Spin（替代自定义加载动画）

```typescript
import { Spin } from 'antd'

// ✅ 正确
<Spin spinning={loading}>
  <Card>内容</Card>
</Spin>

// ❌ 错误
{loading && <div className="animate-spin">...</div>}
```

#### Result（替代自定义错误页面）

```typescript
import { Result, Button } from 'antd'

// ✅ 正确
<Result
  status="error"
  title="错误"
  subTitle="错误描述"
  extra={<Button type="primary">重试</Button>}
/>

// ❌ 错误
<div className="text-center">
  <h1>错误</h1>
  <p>错误描述</p>
</div>
```

#### message / notification（替代 toast）

```typescript
import { message, notification } from 'antd'

// ✅ 正确 - 简单提示
message.success('操作成功')
message.error('操作失败')

// ✅ 正确 - 复杂通知
notification.success({
  message: '操作成功',
  description: '详细信息',
  placement: 'topRight',
})

// ❌ 错误 - 不要使用 sonner（除非特殊场景）
import { toast } from 'sonner'
toast.success('操作成功')
```

### 表单组件

#### Form（统一表单处理）

```typescript
import { Form, Input, Button, Select } from 'antd'

const [form] = Form.useForm()

<Form
  form={form}
  layout="vertical"
  onFinish={handleSubmit}
  initialValues={{ name: '' }}
>
  <Form.Item
    name="name"
    label="名称"
    rules={[{ required: true, message: '请输入名称' }]}
  >
    <Input placeholder="请输入名称" />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit">提交</Button>
  </Form.Item>
</Form>
```

### 数据展示组件

#### Table（统一表格）

```typescript
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const columns: ColumnsType<DataType> = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '操作', key: 'actions', render: (_, record) => <Button>编辑</Button> },
]

<Table
  columns={columns}
  dataSource={data}
  rowKey="id"
  pagination={{ current: 1, total: 100, pageSize: 20 }}
/>
```

#### Empty（空状态）

```typescript
import { Empty } from 'antd'

// ✅ 正确
<Empty description="暂无数据" />

// ❌ 错误
<div className="text-center text-muted-foreground">暂无数据</div>
```

## 🎨 样式使用规范

### Tailwind CSS 使用场景

Tailwind CSS **仅用于以下场景**：

1. **布局和间距**

   ```typescript
   <div className="flex items-center gap-4">
   <div className="p-4 space-y-2">
   ```

2. **响应式断点**

   ```typescript
   <div className="hidden md:block">
   ```

3. **自定义样式补充**
   ```typescript
   <Card className="custom-shadow">
   ```

### 避免使用 Tailwind CSS 的场景

1. **组件样式** - 使用 Ant Design 组件的内置样式
2. **颜色** - 使用 Ant Design 的主题系统
3. **间距** - 优先使用 Ant Design 的 `Space`、`gap` 属性
4. **圆角** - 使用 Ant Design 的 `borderRadius` 配置

## 📐 响应式设计

### 使用 Ant Design Grid

```typescript
import { Row, Col } from 'antd'

<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6} xl={4}>
    <Card>内容</Card>
  </Col>
</Row>
```

### 响应式断点

| 断点 | 宽度     | 说明           |
| ---- | -------- | -------------- |
| xs   | < 576px  | 超小屏（手机） |
| sm   | ≥ 576px  | 小屏（平板）   |
| md   | ≥ 768px  | 中屏（平板）   |
| lg   | ≥ 992px  | 大屏（桌面）   |
| xl   | ≥ 1200px | 超大屏（桌面） |
| xxl  | ≥ 1600px | 超超大屏       |

## 🔧 主题定制

主题配置在 `AntDesignProvider.tsx` 中，会自动继承 Tailwind CSS 的 CSS 变量。

### 自定义组件样式

```typescript
import { ConfigProvider } from 'antd'

<ConfigProvider
  theme={{
    components: {
      Button: {
        borderRadius: 8,
        controlHeight: 36,
      },
    },
  }}
>
  <Button>按钮</Button>
</ConfigProvider>
```

## 📝 最佳实践

### 1. 组件组合

```typescript
// ✅ 正确 - 使用 Ant Design 组件组合
<Card>
  <Space direction="vertical" size="large" className="w-full">
    <Title level={4}>标题</Title>
    <Paragraph>内容</Paragraph>
    <Button type="primary">操作</Button>
  </Space>
</Card>
```

### 2. 加载状态

```typescript
// ✅ 正确 - 使用 Spin 包裹
<Spin spinning={loading}>
  <Card>内容</Card>
</Spin>
```

### 3. 空状态

```typescript
// ✅ 正确
{data.length === 0 ? <Empty /> : <Table dataSource={data} />}
```

### 4. 错误处理

```typescript
// ✅ 正确 - 使用 Result
{error ? (
  <Result status="error" title="错误" subTitle={error.message} />
) : (
  <Card>内容</Card>
)}
```

## 🚫 禁止事项

1. ❌ **不要创建自定义 UI 组件** - 优先使用 Ant Design 组件
2. ❌ **不要使用 Tailwind CSS 实现组件样式** - 使用 Ant Design 主题系统
3. ❌ **不要混用多个 UI 库** - 统一使用 Ant Design
4. ❌ **不要直接修改 Ant Design 组件样式** - 使用主题配置

## 📚 参考资源

- [Ant Design 官方文档](https://ant.design/docs/react/introduce-cn)
- [Ant Design 组件列表](https://ant.design/components/overview-cn)
- [Ant Design 主题定制](https://ant.design/docs/react/customize-theme-cn)
