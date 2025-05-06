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
            id: 1,
            clientId: 1,
            name: 'Factory Automation Upgrade',
            description: 'Upgrade of production line automation systems',
            status: 'In Progress',
            startDate: '2024-01-15',
            endDate: '2024-06-30',
            budget: 250000,
            priority: 'High'
          },
          {
            id: 2,
            clientId: 2,
            name: 'SCADA System Implementation',
            description: 'Implementation of new SCADA system for process monitoring',
            status: 'Planning',
            startDate: '2024-03-01',
            endDate: '2024-08-31',
            budget: 180000,
            priority: 'Medium'
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