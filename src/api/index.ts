import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import type { SettingsState } from '@/store/modules/settings/helper'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatUsage<T = any>() {
  return post<T>({
    url: '/usage',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}
export function saveUserInfo<T>(token: string) {
  return post<T>({
    url: '/saveUserInfo',
    data: { token },
  })
}
export function saveUserAdvinceSetting<T = any>(
  token: string,
  settings: Partial<SettingsState>,
) {
  return post<T>({
    url: '/saveUserAdvinceSetting',
    data: { token, settings },
  })
}

export function login<T = any>(
  username: string,
  password: string,
) {
  return post<T>({
    url: '/login',
    data: { username, password },
  })
}
export function logout<T = any>(
  token: string | null,
) {
  return post<T>({
    url: '/logout',
    data: { token },
  })
}
export function fetchAuth<T>() {
  return post<T>({
    url: '/auth',
  })
}
