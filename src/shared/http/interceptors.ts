import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { env } from '@/shared/config'
import { ROUTES } from '@/shared/constants'
import { getToken } from '@/shared/lib'
import { AUTH_STORAGE_KEY } from '@/features/auth/model'

/**
 * 扩展的请求配置（在拦截器中使用）
 */
interface ExtendedRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean
  skipErrorHandler?: boolean
}

/**
 * HTTP 错误类型
 */
export interface HttpError {
  /** 错误消息 */
  message: string
  /** HTTP 状态码 */
  status?: number
  /** 错误代码 */
  code?: string
  /** 原始错误响应数据 */
  data?: unknown
}

/**
 * 格式化错误消息
 */
function formatErrorMessage(error: AxiosError): string {
  // 优先使用后端返回的错误消息
  const responseData = error.response?.data as
    | { message?: string; error?: string; msg?: string }
    | undefined

  if (responseData?.message) return responseData.message
  if (responseData?.error) return responseData.error
  if (responseData?.msg) return responseData.msg

  // 根据状态码返回默认消息
  const status = error.response?.status
  if (status) {
    const statusMessages: Record<number, string> = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '没有权限访问此资源',
      404: '请求的资源不存在',
      408: '请求超时',
      409: '资源冲突',
      422: '请求参数验证失败',
      429: '请求过于频繁，请稍后再试',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务暂时不可用',
      504: '网关超时',
    }
    return statusMessages[status] || `请求失败 (${status})`
  }

  // 网络错误
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return '请求超时，请检查网络连接'
  }

  if (error.code === 'ERR_NETWORK' || !error.response) {
    return '网络错误，请检查网络连接'
  }

  return error.message || '请求失败，请稍后重试'
}

/**
 * 创建标准化的 HTTP 错误对象
 */
function createHttpError(error: AxiosError): HttpError {
  const responseData = error.response?.data as { code?: string } | undefined

  return {
    message: formatErrorMessage(error),
    status: error.response?.status,
    code: responseData?.code || error.code,
    data: error.response?.data,
  }
}

/**
 * 请求拦截器 - 自动添加 Token 和日志
 */
export function setupRequestInterceptor(api: AxiosInstance) {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const extendedConfig = config as ExtendedRequestConfig

      // 自动添加 Token（除非跳过）
      if (!extendedConfig.skipAuth) {
        const token = getToken()
        if (token) {
          // 使用 AxiosHeaders 的 set 方法（Axios 1.x 推荐方式）
          config.headers.set('Authorization', `Bearer ${token}`)
        }
      }

      // 开发环境请求日志
      if (env.isDev) {
        console.warn(`🚀 [HTTP Request] ${config.method?.toUpperCase()} ${config.url}`, {
          baseURL: config.baseURL,
          headers: config.headers,
          data: config.data,
          params: config.params,
        })
      }

      return config
    },
    (error: AxiosError) => {
      if (env.isDev) {
        console.error('❌ [HTTP Request Error]', error)
      }
      return Promise.reject(error)
    }
  )
}

/**
 * 响应拦截器 - 统一处理和错误格式化
 */
export function setupResponseInterceptor(api: AxiosInstance) {
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      // 开发环境响应日志
      if (env.isDev) {
        console.warn(
          `✅ [HTTP Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
          {
            status: response.status,
            data: response.data,
          }
        )
      }

      // 直接返回 data，简化使用
      return response.data
    },
    (error: AxiosError) => {
      const extendedConfig = error.config as ExtendedRequestConfig | undefined

      // 请求被取消，直接返回（不记录错误日志）
      if (axios.isCancel(error)) {
        if (env.isDev) {
          console.warn(
            `⚠️ [HTTP Request Cancelled] ${error.config?.method?.toUpperCase()} ${error.config?.url}`
          )
        }
        return Promise.reject(error)
      }

      // 开发环境错误日志
      if (env.isDev) {
        const method = error.config?.method?.toUpperCase()
        const url = error.config?.url
        console.error(`❌ [HTTP Error] ${method} ${url}`, error)
        if (error.response) {
          console.error('Response:', error.response.status, error.response.data)
        }
      }

      // 如果跳过错误处理，直接返回原始错误
      if (extendedConfig?.skipErrorHandler) {
        return Promise.reject(error)
      }

      // 401 未授权 - 清除认证信息并跳转登录页
      if (error.response?.status === 401) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        // 避免在登录页重复跳转
        if (window.location.pathname !== ROUTES.LOGIN) {
          window.location.href = ROUTES.LOGIN
        }
      }

      // 转换为标准化的错误对象
      const httpError = createHttpError(error)
      return Promise.reject(httpError)
    }
  )
}

/**
 * 设置所有拦截器
 */
export function setupInterceptors(api: AxiosInstance) {
  setupRequestInterceptor(api)
  setupResponseInterceptor(api)
}
