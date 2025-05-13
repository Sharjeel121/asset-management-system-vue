import { defineStore } from 'pinia'
import appRequest from '@/helpers/request'
import { useClientsStore } from '@/stores/clients'
export const useProductionSitesStore = defineStore('productionSites', {
  state: () => ({
    sites: [],
    clients: [],
    loading: false,
    error: null
  }),

  getters: {
    getSiteById: (state) => (id) => state.sites.find(site => site.id === id)
  },

  actions: {
    async fetchSites() {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.get('/production-sites')
        this.sites = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createSite(siteData) {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.post('/production-sites', siteData)
        this.clients = useClientsStore().clients
        const site = {
          id: this.sites.length + 1,
          ...siteData,
          client: this.clients.find(client => client.id === siteData.client_id)
        }        
        this.sites.push(site)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSite(id, siteData) {
      this.loading = true
      this.error = null

      try {
        const updateSiteData = siteData
        delete updateSiteData.client
        let response = await appRequest.put(`/production-sites/${id}`, updateSiteData)
        const index = this.sites.findIndex(site => site.id === id)
        if (index !== -1) {
          this.sites[index] = siteData
          return siteData
        }
        throw new Error('Site not found')
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteSite(id) {
      this.loading = true
      this.error = null

      try {
        await appRequest.delete(`/production-sites/${id}`)
        const index = this.sites.findIndex(site => site.id === id)
        if (index !== -1) {
          this.sites.splice(index, 1)
        } else {
          throw new Error('Site not found')
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