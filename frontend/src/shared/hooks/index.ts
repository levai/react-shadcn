/**
 * 共享 Hooks
 * 跨功能复用的通用 Hooks
 *
 * 使用 ahooks 作为主要 Hooks 库
 * 文档：https://ahooks.js.org/zh-CN
 */

// 从 ahooks 导出常用 hooks
export {
  useDebounce,
  useThrottle,
  useLocalStorageState,
  useSessionStorageState,
  useToggle,
  usePrevious,
  useClickAway,
  useSize,
  useRequest,
  useVirtualList,
  useInfiniteScroll,
  usePagination,
} from 'ahooks'

// 自定义 hooks（ahooks 中没有的）
export { useMediaQuery } from './useMediaQuery'
