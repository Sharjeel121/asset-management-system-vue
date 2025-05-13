import { defineStore } from 'pinia'
import appRequest from '@/helpers/request'

export const useManufacturersStore = defineStore('manufacturers', {
  state: () => ({
    manufacturers: [],
    loading: false,
    error: null
  }),

  getters: {
    getManufacturerById: (state) => (id) => 
      state.manufacturers.find(manufacturer => manufacturer.id === id)
  },

  actions: {
    async fetchManufacturers() {
      this.loading = true
      this.error = null
      try {
        let response = await appRequest.get('/manufacturers')
        this.manufacturers = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createManufacturer(manufacturerData) {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.post('/manufacturers', manufacturerData)
        await this.fetchManufacturers()
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateManufacturer(id, manufacturerData) {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.put(`/manufacturers/${id}`, manufacturerData)
        const index = this.manufacturers.findIndex(manufacturer => manufacturer.id === id)
        if (index !== -1) {
          this.manufacturers[index] = { ...this.manufacturers[index], ...manufacturerData }
          return response.data
        }
        throw new Error('Manufacturer not found')
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteManufacturer(id) {
      this.loading = true
      this.error = null

      try {
        await appRequest.delete(`/manufacturers/${id}`)
        const index = this.manufacturers.findIndex(manufacturer => manufacturer.id === id)
        if (index !== -1) {
          this.manufacturers.splice(index, 1)
        } else {
          throw new Error('Manufacturer not found')
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