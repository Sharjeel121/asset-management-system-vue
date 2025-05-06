import { defineStore } from 'pinia'
import { useApiStore } from './api'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    getUsersByRole: (state) => (role) => 
      state.users.filter(user => user.role === role),
    getUserById: (state) => (id) => 
      state.users.find(user => user.id === id)
  },

  actions: {
    async fetchUsers() {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        this.users = [
          {
            id: 1,
            firstName: 'Admin',
            lastName: 'User',
            loginId: 'admin',
            role: 'Administrator',
            createdAt: '2024-01-01'
          },
          {
            id: 2,
            firstName: 'Standard',
            lastName: 'User',
            loginId: 'user',
            role: 'Standard User',
            createdAt: '2024-01-02'
          }
        ]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(userData) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const newUser = {
          id: this.users.length + 1,
          ...userData,
          createdAt: new Date().toISOString()
        }
        this.users.push(newUser)
        return newUser
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id, userData) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...userData }
          return this.users[index]
        }
        throw new Error('User not found')
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users.splice(index, 1)
        } else {
          throw new Error('User not found')
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 