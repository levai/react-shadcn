/**
 * Auth Feature - 类型定义
 *
 * 包含认证功能相关的所有类型定义
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

/** 登录请求 */
export interface LoginRequest {
  username: string
  password: string
}

/** 登录响应（业界标准格式） */
export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number | null
  refresh_token?: string | null
}
