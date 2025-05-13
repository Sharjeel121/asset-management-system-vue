import { defineStore } from 'pinia'
import appRequest from '@/helpers/request'

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
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.get('/clients')
        this.clients = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createClient(clientData) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        let response = await appRequest.post('/clients', clientData)
        await this.fetchClients()
        // const newClient = {
        //   id: this.clients.length + 1,
        //   ...clientData
        // }
        // this.clients.push(newClient)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateClient(id, clientData) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        let response = await appRequest.put(`/clients/${id}`, clientData)
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
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.delete(`/clients/${id}`)
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