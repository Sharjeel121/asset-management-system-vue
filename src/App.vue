<template>
  <el-container class="app-container">
    <el-header v-if="isAuthenticated" class="app-header">
      <div class="header-content">
        <h1>Asset Management System</h1>
        <el-dropdown>
          <span class="user-dropdown">
            {{ currentUser?.firstName }} {{ currentUser?.lastName }}
            <el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <el-aside v-if="isAuthenticated" width="200px" class="app-sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/home">
            <el-icon><home-filled /></el-icon>
            <span>Home</span>
          </el-menu-item>

          <!-- Admin Only Menu Items -->
          <template v-if="isAdmin">
            <el-menu-item index="/users">
              <el-icon><user /></el-icon>
              <span>User Management</span>
            </el-menu-item>
          </template>

          <!-- Common Menu Items (Visible to both Admin and Company) -->
          <el-menu-item index="/clients">
            <el-icon><user /></el-icon>
            <span>Clients</span>
          </el-menu-item>
          <el-menu-item index="/projects">
            <el-icon><document /></el-icon>
            <span>Projects</span>
          </el-menu-item>
          <el-menu-item index="/control-cabinets">
            <el-icon><box /></el-icon>
            <span>Control Cabinets</span>
          </el-menu-item>
          <el-menu-item index="/manufacturers">
            <el-icon><office-building /></el-icon>
            <span>Manufacturers</span>
          </el-menu-item>
          <el-menu-item index="/computer-workstations">
            <el-icon><monitor /></el-icon>
            <span>Computer Workstations</span>
          </el-menu-item>
          <el-menu-item index="/automation-products">
            <el-icon><cpu /></el-icon>
            <span>Automation Products</span>
          </el-menu-item>
          <el-menu-item index="/software">
            <el-icon><data-line /></el-icon>
            <span>Software</span>
          </el-menu-item>
          <el-menu-item index="/reports">
            <el-icon><document /></el-icon>
            <span>Reports</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  data() {
    return {
      activeMenu: this.$route.path
    }
  },
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore()
      return authStore.isAuthenticated
    },
    currentUser() {
      const authStore = useAuthStore()
      return authStore.currentUser
    },
    isAdmin() {
      const authStore = useAuthStore()
      return authStore.isAdmin
    }
  },
  methods: {
    logout() {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/'
    }
  },
  watch: {
    '$route.path': {
      handler(newPath) {
        this.activeMenu = newPath
      }
    }
  }
}
</script>

<style>
.app-container {
  height: 100vh;
}

.app-header {
  background-color: #1976d2;
  color: white;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.app-sidebar {
  background-color: #f5f7fa;
  border-right: 1px solid #e6e6e6;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}

.user-dropdown {
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>
