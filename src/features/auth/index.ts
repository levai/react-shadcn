/**
 * Auth Feature - 认证功能模块
 * 
 * 包含登录、登出、用户状态管理等功能
 */

// UI 组件
export { LoginForm, ProtectedRoute } from './ui'

// 状态管理
export { useAuthStore } from './model'

// API 服务
export { authService } from './api'

// 类型定义
export type { User, LoginRequest, LoginResponse } from './types'
