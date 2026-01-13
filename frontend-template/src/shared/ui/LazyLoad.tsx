import { Suspense, type ReactNode } from 'react'
import { PageLoader } from './PageLoader'

/**
 * 懒加载组件包装器
 * 统一处理 Suspense 和 Loading 状态
 */
export function LazyLoad({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}
