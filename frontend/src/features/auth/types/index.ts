/**
 * Auth Feature - 类型定义
 *
 * 包含认证功能相关的所有类型定义
 */

/** 用户信息 */
export interface User {
  id: string
  name: string
  avatar?: string
  roles?: string[]
}

/** 登录请求 */
export interface LoginRequest {
  username: string
  password: string
}

/** 登录响应（后端返回的 data 字段内容） */
export interface LoginResponse {
  token: string
  expireTime: number | null
}
