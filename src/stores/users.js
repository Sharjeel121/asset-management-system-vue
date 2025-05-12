import { defineStore } from 'pinia'
import appRequest from '@/helpers/request'

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
      this.loading = true
      this.error = null
      try {
        let response = await appRequest.get('/users')
        this.users = response.data
        // console.log("🚀 ~ fetchUsers ~ response:", response)
        
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(userData) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        let newUser = {
          id: this.users.length + 1,
          ...userData,
          created_at: new Date().toISOString()
        }

        console.log("🚀 ~ createUser ~ newUser:", newUser)
        let response = await appRequest.post('users',userData)
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
      this.loading = true
      this.error = null

      try {
        let body = userData
        console.log("🚀 ~ updateUser ~ body:", body)
        // TODO: Replace with actual API call
        let response = await appRequest.put(`/users/${id}`, body)
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
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        let response = await appRequest.delete(`users/${id}`)
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