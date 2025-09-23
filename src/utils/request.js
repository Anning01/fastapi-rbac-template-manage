import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Token 管理
const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// 获取 token
const getToken = () => localStorage.getItem(TOKEN_KEY)
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

// 设置 token
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
const setRefreshToken = (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token)

// 清除 token
const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// 是否正在刷新 token
let isRefreshing = false
// 等待刷新 token 的请求队列
let refreshSubscribers = []

// 刷新 token
const refreshToken = async () => {
  const refresh = getRefreshToken()
  if (!refresh) {
    throw new Error('No refresh token')
  }

  try {
    const response = await axios.post('/api/auth/refresh', null, {
      params: { refresh_token: refresh }
    })

    if (response.data.code === 0) {
      const { access_token, refresh_token } = response.data.data
      setToken(access_token)
      setRefreshToken(refresh_token)
      return access_token
    } else {
      throw new Error('Refresh token failed')
    }
  } catch (error) {
    clearTokens()
    throw error
  }
}

// 添加到刷新队列
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback)
}

// 执行刷新队列
const onRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data } = response
    const { code, message } = data

    // 业务状态码处理
    switch (code) {
      case 0:
        // 成功
        return data
      case 422:
        // 参数错误
        ElMessage.error(message || '参数错误')
        return Promise.reject(new Error(message || '参数错误'))
      case 401:
        // token 失效，尝试刷新
        return handleTokenExpired(response.config)
      case 403:
        // 权限不足
        ElMessage.error(message || '权限不足')
        return Promise.reject(new Error(message || '权限不足'))
      case 404:
        // 接口不存在
        ElMessage.error(message || '接口不存在')
        return Promise.reject(new Error(message || '接口不存在'))
      default:
        // 其他错误
        ElMessage.error(message || '请求失败')
        return Promise.reject(new Error(message || '请求失败'))
    }
  },
  async (error) => {
    const { response } = error

    if (response) {
      // HTTP 状态码错误处理
      switch (response.status) {
        case 401:
          // 未授权，尝试刷新 token
          return handleTokenExpired(error.config)
        case 403:
          ElMessage.error('权限不足')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        case 502:
          ElMessage.error('网关错误')
          break
        case 503:
          ElMessage.error('服务不可用')
          break
        case 504:
          ElMessage.error('网关超时')
          break
        default:
          ElMessage.error(`请求失败: ${response.status}`)
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时')
    } else {
      ElMessage.error('网络错误')
    }

    return Promise.reject(error)
  }
)

// 处理 token 过期
const handleTokenExpired = async (originalRequest) => {
  if (isRefreshing) {
    // 如果正在刷新，将请求加入队列
    return new Promise((resolve) => {
      addRefreshSubscriber((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        resolve(service(originalRequest))
      })
    })
  }

  isRefreshing = true

  try {
    const newToken = await refreshToken()
    isRefreshing = false
    onRefreshed(newToken)

    // 重新发送原请求
    originalRequest.headers.Authorization = `Bearer ${newToken}`
    return service(originalRequest)
  } catch (error) {
    isRefreshing = false
    refreshSubscribers = []

    // 刷新失败，跳转到登录页
    ElMessageBox.confirm(
      '登录状态已过期，请重新登录',
      '系统提示',
      {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      clearTokens()
      router.push('/login')
    }).catch(() => {
      clearTokens()
      router.push('/login')
    })

    return Promise.reject(error)
  }
}

// 封装请求方法
const request = {
  get: (url, params, config = {}) => {
    return service.get(url, { params, ...config })
  },

  post: (url, data, config = {}) => {
    return service.post(url, data, config)
  },

  put: (url, data, config = {}) => {
    return service.put(url, data, config)
  },

  delete: (url, config = {}) => {
    return service.delete(url, config)
  },

  patch: (url, data, config = {}) => {
    return service.patch(url, data, config)
  }
}

// 导出 token 管理方法
export const tokenUtils = {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  clearTokens
}

export default request