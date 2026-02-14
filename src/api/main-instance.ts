import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api'

const getBrowserId = (): string => {
  let browserId = localStorage.getItem('browserId')
  if (!browserId) {
    browserId = crypto.randomUUID()
    localStorage.setItem('browserId', browserId)
  }
  return browserId
}

const mainInstance = axios.create({
  baseURL: API_BASE_URL,
})

const mainInstanceRetry = axios.create({
  baseURL: API_BASE_URL,
})

mainInstance.interceptors.request.use(
  (config) => {
    config.headers['x-browser-id'] = getBrowserId()
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

mainInstanceRetry.interceptors.request.use(
  (config) => {
    config.headers['x-browser-id'] = getBrowserId()
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      config.headers.Authorization = `Bearer ${refreshToken}`
      config.headers.withCredentials = true
    }
    return config
  },
  (error) => Promise.reject(error)
)

mainInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      const originalRequest = error.config
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        try {
          const response = await mainInstanceRetry.get('/auth/refresh')
          if (response.status === 200) {
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            return await axios(originalRequest)
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/auth'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default mainInstance
