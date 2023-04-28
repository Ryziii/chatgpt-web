import { deCrypto } from '../crypto'
import { saveUserAdvinceSetting } from '@/api/'
import type { SettingsState } from '@/store/modules/settings/helper'

interface StorageData<T = any> {
  data: T
  expire?: number | null
}

export function saveUserData() {
  function setUserAdvinceSetting<T = any>(key: string, settings: Partial<SettingsState>) {
    // TODO 存入数据库
    saveUserAdvinceSetting<T>(key, settings)
  }

  function getUserAdvinceSetting(key: string) {
    // TODO 从后端获取
    const json = window.localStorage.getItem(key)
    if (json) {
      let storageData: StorageData | null = null

      try {
        storageData = crypto ? deCrypto(json) : JSON.parse(json)
      }
      catch {
        // Prevent failure
      }

      if (storageData) {
        const { data } = storageData
        return data
      }

      removeUserAdvinceSetting(key)
      return null
    }
  }

  function removeUserAdvinceSetting(key: string) {
    // TODO 删除指定用户userInfo
    window.localStorage.removeItem(key)
  }


  return {
    setUserAdvinceSetting,
    getUserAdvinceSetting,
    removeUserAdvinceSetting,
  }
}

export const ls = saveUserData()
