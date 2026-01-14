/**
 * Users Feature - 类型定义
 *
 * 包含用户管理功能相关的所有类型定义
 */

/** 用户信息 */
export interface User {
  id: string
  username: string
  name: string
  avatar?: string | null
  is_active: boolean
  roles?: string[]
  created_at?: string
  updated_at?: string
}

/** 创建用户请求 */
export interface CreateUserRequest {
  username: string
  password: string
  name: string
  avatar?: string | null
}

/** 更新用户请求 */
export interface UpdateUserRequest {
  name?: string
  avatar?: string | null
}

/** 用户列表响应 */
export interface UsersListResponse {
  items: User[]
  total: number
  skip: number
  limit: number
}

/** 用户列表查询参数 */
export interface UsersListParams {
  skip?: number
  limit?: number
  is_active?: boolean
}
