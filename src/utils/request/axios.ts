import axios, { type AxiosResponse } from 'axios'
import { NAlert, createDiscreteApi } from 'naive-ui'
import type { MessageRenderMessage } from 'naive-ui'
import { h } from 'vue'
import { delCookie } from '../functions'
import { useAuthStore } from '@/store'

const renderMessage: MessageRenderMessage = (props) => {
  const { type } = props
  return h(
    NAlert,
    {
      type: type === 'loading' ? 'default' : type,
      title: '身份验证会话过期',
      style: {
        boxShadow: 'var(--n-box-shadow)',
        maxWidth: 'calc(100vw - 32px)',
        width: '480px',
      },
    },
    {
      default: () => props.content,
    },
  )
}

const { message } = createDiscreteApi(
  ['message'],
)
const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response
    throw new Error(response.status.toString())
  },
  (error) => {
    if (error.response.status === 401) {
      delCookie('token')
      message.error('页面将自动跳转，请重新登录', {
        render: renderMessage,
        onAfterLeave: () => {
          window.location.href = '/login'
        },
        duration: 2500,
      })
    }
    return Promise.reject(error)
  },
)

export default service
