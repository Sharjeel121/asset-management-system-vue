import { defineStore } from 'pinia'
import { useApiStore } from './api'

export const useControlCabinetsStore = defineStore('controlCabinets', {
  state: () => ({
    cabinets: [],
    loading: false,
    error: null
  }),

  getters: {
    getCabinetById: (state) => (id) => state.cabinets.find(cabinet => cabinet.id === id),
    getCabinetsByProjectId: (state) => (projectId) => 
      state.cabinets.filter(cabinet => cabinet.projectId === projectId),
    getCabinetsByClientId: (state) => (clientId) => 
      state.cabinets.filter(cabinet => cabinet.clientId === clientId)
  },

  actions: {
    async fetchCabinets() {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        this.cabinets = [
          {
            id: 1,
            clientId: 1,
            projectId: 1,
            name: 'Main Control Cabinet',
            type: 'PLC',
            manufacturer: 'Siemens',
            model: 'S7-1500',
            serialNumber: 'SN123456',
            location: 'Production Line A',
            status: 'Operational',
            installationDate: '2023-05-15',
            lastMaintenanceDate: '2024-01-20',
            nextMaintenanceDate: '2024-07-20',
            notes: 'Regular maintenance required every 6 months'
          },
          {
            id: 2,
            clientId: 2,
            projectId: 2,
            name: 'SCADA Cabinet',
            type: 'HMI',
            manufacturer: 'Rockwell',
            model: 'PanelView Plus 7',
            serialNumber: 'SN789012',
            location: 'Control Room',
            status: 'Operational',
            installationDate: '2023-08-10',
            lastMaintenanceDate: '2024-02-15',
            nextMaintenanceDate: '2024-08-15',
            notes: 'Software updates pending'
          }
        ]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCabinet(cabinetData) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const newCabinet = {
          id: this.cabinets.length + 1,
          ...cabinetData
        }
        this.cabinets.push(newCabinet)
        return newCabinet
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCabinet(id, cabinetData) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const index = this.cabinets.findIndex(cabinet => cabinet.id === id)
        if (index !== -1) {
          this.cabinets[index] = { ...this.cabinets[index], ...cabinetData }
          return this.cabinets[index]
        }
        throw new Error('Cabinet not found')
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCabinet(id) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const index = this.cabinets.findIndex(cabinet => cabinet.id === id)
        if (index !== -1) {
          this.cabinets.splice(index, 1)
        } else {
          throw new Error('Cabinet not found')
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