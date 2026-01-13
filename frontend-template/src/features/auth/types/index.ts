/**
 * Auth Feature - 类型定义
 * 
 * 包含认证功能相关的所有类型定义
 */

/** 用户信息 */
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  roles?: string[]
}

/** 登录请求 */
export interface LoginRequest {
  email: string
  password: string
}

/** 登录响应 */
export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  tokenType: string
  expiryDuration: number
}
