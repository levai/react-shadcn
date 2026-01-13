/**
 * 通用类型定义
 */

/** API 响应包装 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** 分页结果 */
export interface PageResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
