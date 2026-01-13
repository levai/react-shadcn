/**
 * 首页
 */
const HomePage = () => {
  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {/* Welcome Card */}
      <div className='col-span-full p-6 bg-card rounded-lg border'>
        <h2 className='text-2xl font-bold mb-2'>欢迎使用 Frontend Template</h2>
        <p className='text-muted-foreground'>这是一个基于 FSD 架构的企业级前端模板，专为 AI 编程工具优化。</p>
      </div>

      {/* Feature Cards */}
      {features.map(feature => (
        <div key={feature.title} className='p-6 bg-card rounded-lg border hover:shadow-md transition-shadow'>
          <div className='text-3xl mb-3'>{feature.icon}</div>
          <h3 className='font-semibold mb-2'>{feature.title}</h3>
          <p className='text-sm text-muted-foreground'>{feature.description}</p>
        </div>
      ))}
    </div>
  )
}

const features = [
  {
    icon: '🏗️',
    title: 'FSD 架构',
    description: '按功能模块组织代码，边界清晰，AI 更易理解',
  },
  {
    icon: '🤖',
    title: 'AI 友好',
    description: '包含 Cursor/Copilot 规范配置和工作流模板',
  },
  {
    icon: '⚡',
    title: '现代技术栈',
    description: 'React 19 + Vite + TypeScript + Tailwind CSS',
  },
  {
    icon: '🔐',
    title: '认证系统',
    description: '完整的登录认证流程，Zustand 状态管理',
  },
  {
    icon: '📦',
    title: '代码分割',
    description: '路由级懒加载，优化首屏加载速度',
  },
  {
    icon: '📝',
    title: '规范文档',
    description: '详细的开发规范和代码模板',
  },
]

export default HomePage
