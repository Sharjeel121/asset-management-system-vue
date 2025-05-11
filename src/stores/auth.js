import appRequest from '@/helpers/request'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userFullName: (state) => state.currentUser ? `${state.currentUser.first_name} ${state.currentUser.last_name}` : '',
    isAdmin: (state) => state.currentUser?.role === 'administrator',
    isCompany: (state) => state.currentUser?.role === 'user',
    hasPermission: (state) => (permission) => {
      if (state.currentUser?.role === 'administrator') return true
      return state.currentUser?.permissions?.includes(permission) || false
    }
  },

  actions: {
    async login(data) {
      try {
        // TODO: Replace with actual API call
        const users = {
          'admin@example.com': {
            token: 'admin-token',
            user: {
              id: 1,
              firstName: 'Admin',
              lastName: 'User',
              loginId: 'admin@example.com',
              role: 'Admin',
              companyId: null
            }
          },
          'company@example.com': {
            token: 'company-token',
            user: {
              id: 2,
              firstName: 'Company',
              lastName: 'User',
              loginId: 'company@example.com',
              role: 'Company',
              companyId: 1
            }
          }
        }

        // const response = users[credentials.loginId] || null
        const body = {
          user_name: data.loginId,
          password: data.password
        }
        const response = await appRequest.post('/login', body)
        

        this.token = response.access_token
        this.currentUser = response.user

        localStorage.setItem('token', response.token)
        localStorage.setItem('currentUser', JSON.stringify(response.user))
        
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    logout() {
      this.token = null
      this.currentUser = null
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
    }
  }
}) 