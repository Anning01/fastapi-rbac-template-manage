import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/api/auth'
import router from '@/router'
import { tokenUtils } from '@/utils/request'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(tokenUtils.getToken() || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  function setTokens(accessToken, refreshToken) {
    token.value = accessToken
    tokenUtils.setToken(accessToken)
    if (refreshToken) {
      tokenUtils.setRefreshToken(refreshToken)
    }
  }

  function clearAuth() {
    token.value = null
    user.value = null
    tokenUtils.clearTokens()
  }

  async function login(credentials) {
    try {
      const response = await loginApi(credentials)
      // Assuming the response.data contains the token info, based on the interceptor
      const { access_token, refresh_token } = response.data
      setTokens(access_token, refresh_token)
      
      // You might want to fetch user info here as well
      // await fetchUserInfo()
      return true
    } catch (error) {
      console.error('Login failed:', error)
      clearAuth()
      return false
    }
  }

  function logout() {
    clearAuth()
    // Redirect to login page
    router.push('/login')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  }
})
