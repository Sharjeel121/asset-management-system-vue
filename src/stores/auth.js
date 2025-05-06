import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userFullName: (state) => state.currentUser ? `${state.currentUser.firstName} ${state.currentUser.lastName}` : '',
    isAdmin: (state) => state.currentUser?.role === 'Admin',
    isCompany: (state) => state.currentUser?.role === 'Company',
    hasPermission: (state) => (permission) => {
      if (state.currentUser?.role === 'Admin') return true
      return state.currentUser?.permissions?.includes(permission) || false
    }
  },

  actions: {
    async login(credentials) {
      try {
        // TODO: Replace with actual API call
        const users = {
          'admin@example.com': {
            token: 'admin-token',
            user: {
              id: 1,
              firstName: 'Admin',
              lastName: 'User',
              loginId: 'admin@example.com',
              role: 'Admin',
              permissions: [
                'all',
                // User Management
                'view_users',
                'add_user',
                'edit_user',
                'delete_user',
                'manage_user_roles'
              ],
              companyId: null
            }
          },
          'company@example.com': {
            token: 'company-token',
            user: {
              id: 2,
              firstName: 'Company',
              lastName: 'User',
              loginId: 'company@example.com',
              role: 'Company',
              companyId: 1,
              permissions: [
                // Clients
                'view_clients',
                'add_client',
                'edit_client',
                'delete_client',
                // Projects
                'view_projects',
                'add_project',
                'edit_project',
                'delete_project',
                // Control Cabinets
                'view_control_cabinets',
                'add_control_cabinet',
                'edit_control_cabinet',
                'delete_control_cabinet',
                // Manufacturers
                'view_manufacturers',
                'add_manufacturer',
                'edit_manufacturer',
                'delete_manufacturer',
                // Automation Products
                'view_automation_products',
                'add_automation_product',
                'edit_automation_product',
                'delete_automation_product',
                // Computer Workstations
                'view_computer_workstations',
                'add_computer_workstation',
                'edit_computer_workstation',
                'delete_computer_workstation',
                // Software
                'view_software',
                'add_software',
                'edit_software',
                'delete_software',
                // Reports
                'view_reports',
                'generate_reports'
              ]
            }
          }
        }

        const response = users[credentials.loginId] || null

        if (!response) {
          throw new Error('Invalid credentials')
        }

        this.token = response.token
        this.currentUser = response.user

        localStorage.setItem('token', response.token)
        localStorage.setItem('currentUser', JSON.stringify(response.user))
        
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    logout() {
      this.token = null
      this.currentUser = null
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
    }
  }
}) 