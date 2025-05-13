import { defineStore } from 'pinia'
import appRequest from '@/helpers/request'
import { useClientsStore } from '@/stores/clients'
import { useProductionSitesStore } from '@/stores/productionSites'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    loading: false,
    error: null
  }),

  getters: {
    getProjectById: (state) => (id) => state.projects.find(project => project.id === id)
  },

  actions: {
    async fetchProjects() {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.get('/projects')
        this.projects = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createProject(projectData) {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.post('/projects', projectData)
        
        const clientsStore = useClientsStore()
        const sitesStore = useProductionSitesStore()
        
        const project = {
          id: this.projects.length + 1,
          ...projectData,
          client: clientsStore.clients.find(client => client.id === projectData.client_id),
          production_site: sitesStore.sites.find(site => site.id === projectData.production_site_id)
        }
        console.log("🚀 ~ createProject ~ project:", project)
        
        this.projects.push(project)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProject(id, projectData) {
      this.loading = true
      this.error = null

      try {
        let response = await appRequest.put(`/projects/${id}`, projectData)

        const clientsStore = useClientsStore()
        const sitesStore = useProductionSitesStore()
        const updateProjectData = {
          id: this.projects.length + 1,
          ...projectData,
          client: clientsStore.clients.find(client => client.id === projectData.client_id),
          production_site: sitesStore.sites.find(site => site.id === projectData.production_site_id)
        }
        const index = this.projects.findIndex(project => project.id === id)
        if (index !== -1) {
          this.projects[index] = updateProjectData
          console.log(this.projects[index]);
          
          return response
        }
        throw new Error('Project not found')
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProject(id) {
      this.loading = true
      this.error = null

      try {
        await appRequest.delete(`/projects/${id}`)
        const index = this.projects.findIndex(project => project.id === id)
        if (index !== -1) {
          this.projects.splice(index, 1)
        } else {
          throw new Error('Project not found')
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
