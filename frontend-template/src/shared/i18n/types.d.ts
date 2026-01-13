/**
 * i18next TypeScript 类型定义
 * 
 * 提供类型安全的翻译键，支持自动补全和类型检查
 */
import 'react-i18next'

// 导入语言资源类型
import commonZhCN from './locales/zh-CN/common'
import authZhCN from './locales/zh-CN/auth'
import layoutZhCN from './locales/zh-CN/layout'
import homeZhCN from './locales/zh-CN/home'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    // 默认命名空间
    defaultNS: 'common'
    // 资源类型定义
    resources: {
      common: typeof commonZhCN
      auth: typeof authZhCN
      layout: typeof layoutZhCN
      home: typeof homeZhCN
    }
  }
}
