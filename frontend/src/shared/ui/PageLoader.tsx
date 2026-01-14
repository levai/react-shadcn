import { Spin } from 'antd'

/**
 * 页面加载器
 * 使用 Ant Design Spin 组件
 */
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" />
    </div>
  )
}
