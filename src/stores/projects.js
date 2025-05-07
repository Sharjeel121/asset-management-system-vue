import { defineStore } from 'pinia'
import { useApiStore } from './api'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    loading: false,
    error: null
  }),

  getters: {
    getProjectById: (state) => (id) => state.projects.find(project => project.id === id),
    getProjectsByClientId: (state) => (clientId) => 
      state.projects.filter(project => project.clientId === clientId)
  },

  actions: {
    async fetchProjects() {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        this.projects = [
          {
            number: "PRJ-1001",
            description: "Solar panel installation",
            purchaseOrderDate: "2024-01-15",
            commissioningDate: "2024-05-20",
            client: "GreenTech Ltd.",
            site: "Solar Farm Alpha, California"
          },
          {
            number: "PRJ-1002",
            description: "HVAC system upgrade",
            purchaseOrderDate: "2024-02-28",
            commissioningDate: "2024-06-10",
            client: "CoolAir Inc.",
            site: "Factory B, New Jersey"
          }
        ]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createProject(projectData) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const newProject = {
          id: this.projects.length + 1,
          ...projectData
        }
        this.projects.push(newProject)
        return newProject
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProject(id, projectData) {
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        const index = this.projects.findIndex(project => project.id === id)
        if (index !== -1) {
          this.projects[index] = { ...this.projects[index], ...projectData }
          return this.projects[index]
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
      const apiStore = useApiStore()
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
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