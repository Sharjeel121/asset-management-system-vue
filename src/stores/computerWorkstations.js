import { defineStore } from 'pinia'
import appRequest from '@/helpers/request'
import { useProductionSitesStore } from '@/stores/productionSites'
import { useManufacturersStore } from '@/stores/manufacturers'

export const useComputerWorkstationsStore = defineStore('computerWorkstations', {
  state: () => ({
    workstations: [],
    loading: false,
    error: null
  }),

  getters: {
    getWorkstationById: (state) => (id) => 
      state.workstations.find(workstation => workstation.id === id)
  },

  actions: {
    async fetchWorkstations() {
      this.loading = true
      this.error = null
      try {
        let response = await appRequest.get('/computer-workstations')
        this.workstations = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createWorkstation(workstationData) {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.post('/computer-workstations', workstationData)
        await this.fetchWorkstations()
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateWorkstation(id, workstationData) {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.put(`/computer-workstations/${id}`, workstationData)
        const index = this.workstations.findIndex(workstation => workstation.id === id)
        if (index !== -1) {
          this.workstations[index] = { ...this.workstations[index], ...workstationData }
          return response.data
        }
        throw new Error('Workstation not found')
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteWorkstation(id) {
      this.loading = true
      this.error = null

      try {
        await appRequest.delete(`/computer-workstations/${id}`)
        const index = this.workstations.findIndex(workstation => workstation.id === id)
        if (index !== -1) {
          this.workstations.splice(index, 1)
        } else {
          throw new Error('Workstation not found')
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