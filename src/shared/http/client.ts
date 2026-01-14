import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/shared/config'
import { setupInterceptors } from './interceptors'

/**
 * 扩展的请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否跳过自动添加 Token（默认 false） */
  skipAuth?: boolean
  /** 是否跳过统一错误处理（默认 false） */
  skipErrorHandler?: boolean
  // signal 属性已包含在 AxiosRequestConfig 中，无需重复定义
}

/**
 * 请求客户端类
 * 封装 Axios 实例，提供统一的 HTTP 请求方法
 */
export class RequestClient {
  /** Axios 实例 */
  public readonly instance: AxiosInstance

  /**
   * 构造函数
   * @param options Axios 请求配置选项
   */
  constructor(options: AxiosRequestConfig = {}) {
    const defaultConfig: AxiosRequestConfig = {
      baseURL: env.apiBaseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    // 深度合并配置（特别是 headers）
    const config: AxiosRequestConfig = {
      ...defaultConfig,
      ...options,
      headers: {
        ...defaultConfig.headers,
        ...(options.headers || {}),
      },
    }

    // 创建 Axios 实例
    this.instance = axios.create(config)

    // 设置拦截器
    setupInterceptors(this.instance)
  }

  /**
   * 统一请求方法
   * @param url 请求 URL
   * @param config 请求配置
   * @returns Promise<T> 返回响应数据
   */
  public async request<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.request<T, T>({ url, ...config })
  }

  /**
   * GET 请求
   * @param url 请求 URL
   * @param config 请求配置
   * @returns Promise<T> 返回响应数据
   */
  public async get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get<T, T>(url, config)
  }

  /**
   * POST 请求
   * @param url 请求 URL
   * @param data 请求体数据
   * @param config 请求配置
   * @returns Promise<T> 返回响应数据
   */
  public async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig
  ): Promise<T> {
    return this.instance.post<T, T, D>(url, data, config)
  }

  /**
   * PUT 请求
   * @param url 请求 URL
   * @param data 请求体数据
   * @param config 请求配置
   * @returns Promise<T> 返回响应数据
   */
  public async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig
  ): Promise<T> {
    return this.instance.put<T, T, D>(url, data, config)
  }

  /**
   * PATCH 请求
   * @param url 请求 URL
   * @param data 请求体数据
   * @param config 请求配置
   * @returns Promise<T> 返回响应数据
   */
  public async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig
  ): Promise<T> {
    return this.instance.patch<T, T, D>(url, data, config)
  }

  /**
   * DELETE 请求
   * @param url 请求 URL
   * @param config 请求配置
   * @returns Promise<T> 返回响应数据
   */
  public async delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete<T, T>(url, config)
  }

  /**
   * 获取基础 URL
   */
  public getBaseUrl(): string | undefined {
    return this.instance.defaults.baseURL
  }

  /**
   * 创建 AbortController
   * 用于取消请求
   * @returns AbortController 实例
   * @example
   * ```typescript
   * const controller = clientHttp.createAbortController()
   * const promise = clientHttp.get('/api/data', { signal: controller.signal })
   * // 取消请求
   * controller.abort()
   * ```
   */
  public createAbortController(): AbortController {
    return new AbortController()
  }

  /**
   * 添加请求拦截器
   * 允许动态添加额外的请求拦截器
   * @param onFulfilled 成功回调
   * @param onRejected 失败回调
   * @returns 拦截器 ID（可用于移除）
   * @example
   * ```typescript
   * const interceptorId = clientHttp.addRequestInterceptor(
   *   (config) => {
   *     // 添加自定义 header
   *     config.headers['X-Custom-Header'] = 'value'
   *     return config
   *   },
   *   (error) => Promise.reject(error)
   * )
   * ```
   */
  public addRequestInterceptor(
    onFulfilled?: (
      value: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
    onRejected?: (error: unknown) => unknown
  ): number {
    return this.instance.interceptors.request.use(onFulfilled, onRejected)
  }

  /**
   * 添加响应拦截器
   * 允许动态添加额外的响应拦截器
   * @param onFulfilled 成功回调
   * @param onRejected 失败回调
   * @returns 拦截器 ID（可用于移除）
   * @example
   * ```typescript
   * const interceptorId = clientHttp.addResponseInterceptor(
   *   (response) => {
   *     // 处理响应
   *     return response
   *   },
   *   (error) => Promise.reject(error)
   * )
   * ```
   */
  public addResponseInterceptor(
    onFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: unknown) => unknown
  ): number {
    return this.instance.interceptors.response.use(onFulfilled, onRejected)
  }

  /**
   * 移除请求拦截器
   * @param id 拦截器 ID（由 addRequestInterceptor 返回）
   */
  public removeRequestInterceptor(id: number): void {
    this.instance.interceptors.request.eject(id)
  }

  /**
   * 移除响应拦截器
   * @param id 拦截器 ID（由 addResponseInterceptor 返回）
   */
  public removeResponseInterceptor(id: number): void {
    this.instance.interceptors.response.eject(id)
  }
}

// 创建并导出默认实例
export const clientHttp = new RequestClient()
