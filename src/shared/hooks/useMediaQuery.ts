import { useState, useEffect, useRef } from 'react'

/**
 * 媒体查询 Hook
 * 监听窗口尺寸变化，返回是否匹配指定的媒体查询
 *
 * @param query - 媒体查询字符串，如 '(min-width: 768px)'
 * @returns 是否匹配媒体查询
 *
 * @example
 * ```tsx
 * const isDesktop = useMediaQuery('(min-width: 1024px)')
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  // 使用 ref 跟踪 query 变化，避免在 effect 中同步更新状态
  const queryRef = useRef(query)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)

    // 只在 query 变化时（非首次挂载）才需要更新状态
    // 首次挂载时，useState 的初始化函数已经设置了正确的值
    if (!isInitialMount.current && queryRef.current !== query) {
      // 使用微任务异步更新，避免在 effect body 中同步调用 setState
      queueMicrotask(() => {
        setMatches(mediaQuery.matches)
      })
    }

    queryRef.current = query
    isInitialMount.current = false

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // 使用 addEventListener（现代浏览器推荐）
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      // 兼容旧浏览器
      mediaQuery.addListener(handler)
      return () => mediaQuery.removeListener(handler)
    }
  }, [query])

  return matches
}
