import { defineStore } from 'pinia'
import appRequest from '@/helpers/request'
import { useProductionSitesStore } from '@/stores/productionSites'

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
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.get('/control-cabinets')
        this.cabinets = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCabinet(cabinetData) {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.post('/control-cabinets', cabinetData)
        
        const sitesStore = useProductionSitesStore()
        await this.fetchCabinets()
        // const cabinet = {
        //   id: this.cabinets.length + 1,
        //   ...cabinetData,
        //   production_site: sitesStore.sites.find(site => site.id === cabinetData.production_site_id)
        // }
        
        // this.cabinets.push(cabinet)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCabinet(id, cabinetData) {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.put(`/control-cabinets/${id}`, cabinetData)

        const sitesStore = useProductionSitesStore()
        const updateCabinetData = {
          id: id,
          ...cabinetData,
          production_site: sitesStore.sites.find(site => site.id === cabinetData.production_site_id)
        }
        
        const index = this.cabinets.findIndex(cabinet => cabinet.id === id)
        if (index !== -1) {
          this.cabinets[index] = updateCabinetData
          return response
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
      this.loading = true
      this.error = null

      try {
        await appRequest.delete(`/control-cabinets/${id}`)
       
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