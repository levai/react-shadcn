/**
 * 首页相关翻译 - 简体中文
 *
 * 命名空间：home（功能模块）
 * 使用方式：useTranslation('home') 然后 t('homePage.welcome.title')
 *
 * 符合业界主流：按功能模块分组，页面内容使用 [pageName]Page 键
 */
export default {
  // 首页页面内容
  homePage: {
    welcome: {
      title: '欢迎使用 Frontend Template',
      description: '这是一个基于 FSD 架构的企业级前端模板，专为 AI 编程工具优化。',
    },
    features: {
      fsdArchitecture: {
        title: 'FSD 架构',
        description: '按功能模块组织代码，边界清晰，AI 更易理解',
      },
      aiFriendly: {
        title: 'AI 友好',
        description: '包含 Cursor/Copilot 规范配置和工作流模板',
      },
      modernStack: {
        title: '现代技术栈',
        description: 'React 19 + Vite + TypeScript + Tailwind CSS',
      },
      authSystem: {
        title: '认证系统',
        description: '完整的登录认证流程，Zustand 状态管理',
      },
      codeSplitting: {
        title: '代码分割',
        description: '路由级懒加载，优化首屏加载速度',
      },
      documentation: {
        title: '规范文档',
        description: '详细的开发规范和代码模板',
      },
    },
  },
} as const
