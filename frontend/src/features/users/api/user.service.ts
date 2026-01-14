/**
 * Users Feature - API 服务
 *
 * 用户管理相关的 API 调用
 */

import { clientHttp } from '@/shared/http'
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UsersListResponse,
  UsersListParams,
} from '../types'

const API = {
  USERS: '/v1/users',
  USER_BY_ID: (id: string) => `/v1/users/${id}`,
  TOGGLE_ACTIVE: (id: string) => `/v1/users/${id}/toggle-active`,
} as const

/**
 * 用户服务
 */
const userService = {
  /** 获取用户列表 */
  getUsers: async (params?: UsersListParams): Promise<UsersListResponse> => {
    return clientHttp.get<UsersListResponse>(API.USERS, { params })
  },

  /** 根据 ID 获取用户 */
  getUserById: async (id: string): Promise<User> => {
    return clientHttp.get<User>(API.USER_BY_ID(id))
  },

  /** 创建用户 */
  createUser: async (data: CreateUserRequest): Promise<User> => {
    return clientHttp.post<User, CreateUserRequest>(API.USERS, data)
  },

  /** 更新用户 */
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    return clientHttp.put<User, UpdateUserRequest>(API.USER_BY_ID(id), data)
  },

  /** 删除用户 */
  deleteUser: async (id: string): Promise<void> => {
    return clientHttp.delete<void>(API.USER_BY_ID(id))
  },

  /** 切换用户激活状态 */
  toggleUserActive: async (id: string): Promise<User> => {
    return clientHttp.patch<User>(API.TOGGLE_ACTIVE(id))
  },
}

export default userService
