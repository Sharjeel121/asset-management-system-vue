import { defineStore } from 'pinia'
import { useApiStore } from './api'

export const useClientsStore = defineStore('clients', {
  state: () => ({
    clients: [],
    loading: false,
    error: null
  }),

  getters: {
    getClientById: (state) => (id) => state.clients.find(client => client.id === id)
  },

  actions: {
    async fetchClients() {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        this.clients = [
          {
            id: 1,
            name: 'ABC Manufacturing',
            industry: 'Automotive',
            location: 'Detroit, MI',
            contactPerson: 'John Smith',
            email: 'john.smith@abcmfg.com',
            phone: '(555) 123-4567'
          },
          {
            id: 2,
            name: 'XYZ Industries',
            industry: 'Electronics',
            location: 'San Jose, CA',
            contactPerson: 'Jane Doe',
            email: 'jane.doe@xyzind.com',
            phone: '(555) 987-6543'
          }
        ]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createClient(clientData) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const newClient = {
          id: this.clients.length + 1,
          ...clientData
        }
        this.clients.push(newClient)
        return newClient
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateClient(id, clientData) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const index = this.clients.findIndex(client => client.id === id)
        if (index !== -1) {
          this.clients[index] = { ...this.clients[index], ...clientData }
          return this.clients[index]
        }
        throw new Error('Client not found')
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteClient(id) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const index = this.clients.findIndex(client => client.id === id)
        if (index !== -1) {
          this.clients.splice(index, 1)
        } else {
          throw new Error('Client not found')
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