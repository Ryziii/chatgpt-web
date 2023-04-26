import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'
import { getCookie } from '@/utils/functions'

const roster = ['/login', '/lo']
export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    try {
      const token = getCookie('token')
      if (roster.includes(to.path)) {
        token ? next({ name: 'Root' }) : next()
        return
      }

      token ? next() : next('/login')
    }
    catch (error) {
      if (to.path !== '/500')
        next({ name: '500' })
      else
        next()
    }
    const authStore = useAuthStoreWithout()
    if (!authStore.session) {
      try {
        const data = await authStore.getSession()
        if (String(data.auth) === 'false' && authStore.token)
          authStore.removeToken()
        if (to.path === '/500')
          next({ name: 'Root' })
        else
          next()
      }
      catch (error) {
        if (to.path !== '/500')
          next({ name: '500' })
        else
          next()
      }
    }
    else {
      next()
    }
  })
}
