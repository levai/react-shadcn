import { request } from '@/shared/api'
import type { User, LoginRequest, LoginResponse } from '../types'

const API = {
  LOGIN: '/v1/auth/login',
  LOGOUT: '/v1/auth/logout',
  CURRENT_USER: '/v1/users/me',
} as const

/**
 * 认证服务
 */
const authService = {
  /** 登录 */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return request<LoginResponse>(API.LOGIN, {
      method: 'POST',
      data,
    })
  },

  /** 登出 */
  logout: async (): Promise<void> => {
    return request<void>(API.LOGOUT, {
      method: 'POST',
    })
  },

  /** 获取当前用户 */
  getCurrentUser: async (): Promise<User> => {
    return request<User>(API.CURRENT_USER, {
      method: 'GET',
    })
  },
}

export default authService
