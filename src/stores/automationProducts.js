import { defineStore } from 'pinia'
import appRequest from '@/helpers/request'
import { useProductionSitesStore } from '@/stores/productionSites'
import { useManufacturersStore } from '@/stores/manufacturers'
import { useControlCabinetsStore } from '@/stores/controlCabinets'

export const useAutomationProductsStore = defineStore('automationProducts', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),

  getters: {
    getProductById: (state) => (id) => state.products.find(product => product.id === id)
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        let response = await appRequest.get('/automation-products')
        this.products = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createProduct(productData) {
      this.loading = true
      this.error = null
      try {
        let response = await appRequest.post('/automation-products', productData)
        await this.fetchProducts()
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id, productData) {
      this.loading = true
      this.error = null
      try {
        let response = await appRequest.put(`/automation-products/${id}`, productData)
        const index = this.products.findIndex(product => product.id === id)
        if (index !== -1) {
          // Fetch related objects from their stores
          const sitesStore = useProductionSitesStore()
          const manufacturersStore = useManufacturersStore()
          const cabinetsStore = useControlCabinetsStore()
          const production_site = sitesStore.sites.find(site => site.id === productData.production_site_id)
          const manufacturer = manufacturersStore.manufacturers.find(m => m.id === productData.manufacturer_id)
          const control_cabinet = cabinetsStore.cabinets.find(c => c.id === productData.control_cabinet_id)

          this.products[index] = {
            ...this.products[index],
            ...productData,
            production_site,
            manufacturer,
            control_cabinet
          }
          return response.data
        }
        throw new Error('Product not found')
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id) {
      this.loading = true
      this.error = null
      try {
        await appRequest.delete(`/automation-products/${id}`)
        const index = this.products.findIndex(product => product.id === id)
        if (index !== -1) {
          this.products.splice(index, 1)
        } else {
          throw new Error('Product not found')
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