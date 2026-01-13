import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { env, getStorageKey } from '@/shared/config'

/** 认证存储 key */
const AUTH_STORAGE_KEY = getStorageKey('auth')

/**
 * Axios 实例
 */
export const api: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 从 auth storage 获取 token
 */
function getToken(): string | null {
  try {
    const authStorage = localStorage.getItem(AUTH_STORAGE_KEY)
    if (authStorage) {
      const data = JSON.parse(authStorage)
      return data?.state?.accessToken || null
    }
  } catch {
    // 忽略解析错误
  }
  return null
}

// 请求拦截器 - 自动添加 Token
api.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器 - 统一处理
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  error => {
    // 401 未授权，清除状态并跳转登录页
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * 统一请求函数
 */
export async function request<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return api.request<T, T>({ url, ...config })
}

export default request
