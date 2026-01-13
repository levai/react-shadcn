/**
 * i18n 国际化
 *
 * 使用方式：
 * ```typescript
 * import { useTranslation } from '@/shared/i18n'
 *
 * // 单个命名空间
 * function Component() {
 *   const { t } = useTranslation('common')
 *   return <div>{t('actions.confirm')}</div>  // 嵌套结构
 * }
 *
 * // 多个命名空间
 * const { t } = useTranslation(['layout', 'auth'])
 * t('nav.home')                    // layout 命名空间
 * t('auth:messages.loginSuccess')   // auth 命名空间（嵌套结构）
 * ```
 *
 * 翻译结构：
 * - 所有翻译使用嵌套结构，按功能分组
 * - common: actions.*, status.*, messages.*, validation.*, pagination.*
 * - auth: form.*, loginPage.*, messages.*
 * - layout: nav.*, theme.*, language.*, sidebar.*
 * - home: homePage.*（功能模块，页面内容使用 [pageName]Page 键）
 *
 * 命名规范（符合业界主流）：
 * - 功能模块命名空间：使用功能名（auth, layout, home）
 * - 页面内容键名：使用 [pageName]Page 格式（loginPage.*, homePage.*）
 * - 使用方式：useTranslation('home') 然后 t('homePage.welcome.title')
 *
 * 注意：类型定义在 types.d.ts 中，TypeScript 会自动识别，无需显式导入
 */

export { default } from './config'
export { useTranslation } from 'react-i18next'
