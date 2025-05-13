import { defineStore } from 'pinia'
import appRequest from '@/helpers/request'
import { useProductionSitesStore } from '@/stores/productionSites'
import { useManufacturersStore } from '@/stores/manufacturers'
import { useComputerWorkstationsStore } from '@/stores/computerWorkstations'

export const useSoftwareStore = defineStore('software', {
  state: () => ({
    software: [],
    loading: false,
    error: null
  }),

  getters: {
    getSoftwareById: (state) => (id) => state.software.find(soft => soft.id === id)
  },

  actions: {
    async fetchSoftware() {
      this.loading = true
      this.error = null
      try {
        let response = await appRequest.get('/software')
        this.software = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createSoftware(softwareData) {
      this.loading = true
      this.error = null
      try {
        let response = await appRequest.post('/software', softwareData)
        await this.fetchSoftware()
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSoftware(id, softwareData) {
      this.loading = true
      this.error = null
      try {
        let response = await appRequest.put(`/software/${id}`, softwareData)
        const index = this.software.findIndex(soft => soft.id === id)
        if (index !== -1) {
          // Fetch related objects from their stores
          const sitesStore = useProductionSitesStore()
          const manufacturersStore = useManufacturersStore()
          const workstationsStore = useComputerWorkstationsStore()
          const production_site = sitesStore.sites.find(site => site.id === softwareData.production_site_id)
          const manufacturer = manufacturersStore.manufacturers.find(m => m.id === softwareData.manufacturer_id)
          const computer_workstation = workstationsStore.workstations.find(ws => ws.id === softwareData.computer_workstation_id)

          this.software[index] = {
            ...this.software[index],
            ...softwareData,
            production_site,
            manufacturer,
            computer_workstation
          }
          return response.data
        }
        throw new Error('Software not found')
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteSoftware(id) {
      this.loading = true
      this.error = null
      try {
        await appRequest.delete(`/software/${id}`)
        const index = this.software.findIndex(soft => soft.id === id)
        if (index !== -1) {
          this.software.splice(index, 1)
        } else {
          throw new Error('Software not found')
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