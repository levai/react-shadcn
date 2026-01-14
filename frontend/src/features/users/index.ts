/**
 * Users Feature - 用户管理功能模块
 *
 * 包含用户列表、创建、更新、删除等功能
 */

// API 服务
export { userService } from './api'

// 类型定义
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UsersListResponse,
  UsersListParams,
} from './types'

// UI 组件
export { UserList } from './ui/UserList'
export { UserForm } from './ui/UserForm'
