import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useApiStore = defineStore('api', {
  state: () => ({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    loading: false,
    error: null
  }),

  actions: {
    async request(method, endpoint, data = null) {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null

      try {
        const headers = {
          'Content-Type': 'application/json'
        }

        if (authStore.token) {
          headers['Authorization'] = `Bearer ${authStore.token}`
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method,
          headers,
          body: data ? JSON.stringify(data) : null
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async get(endpoint) {
      return this.request('GET', endpoint)
    },

    async post(endpoint, data) {
      return this.request('POST', endpoint, data)
    },

    async put(endpoint, data) {
      return this.request('PUT', endpoint, data)
    },

    async delete(endpoint) {
      return this.request('DELETE', endpoint)
    }
  }
}) 