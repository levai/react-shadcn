import { clientHttp } from '@/shared/http'
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
    return clientHttp.post<LoginResponse, LoginRequest>(API.LOGIN, data)
  },

  /** 登出 */
  logout: async (): Promise<void> => {
    return clientHttp.post<void>(API.LOGOUT)
  },

  /** 获取当前用户 */
  getCurrentUser: async (): Promise<User> => {
    return clientHttp.get<User>(API.CURRENT_USER)
  },
}

export default authService
