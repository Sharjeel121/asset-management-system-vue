<template>
  <el-container class="app-container">
    <el-header v-if="isAuthenticated" class="app-header">
      <div class="header-content">
        <div class="header-left">
          <button class="sidebar-toggle" @click="sidebarOpen = !sidebarOpen" v-if="isAuthenticated">
            <el-icon v-if="!sidebarOpen"><Expand /></el-icon>
            <el-icon v-else><Fold /></el-icon>
          </button>
          <h1>AMS</h1>
        </div>
        <el-dropdown>
          <span class="user-dropdown">
            {{ currentUser && currentUser.firstName }} {{ currentUser && currentUser.lastName }}
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
      <el-aside
        v-show="isAuthenticated && (!isMobile || sidebarOpen)"
        :class="['app-sidebar', { open: sidebarOpen && isMobile }]"
        width="220px"
        @click.self="sidebarOpen = false"
      >
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
      activeMenu: this.$route.path,
      sidebarOpen: false,
      isMobile: false
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
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 900
      if (!this.isMobile) this.sidebarOpen = false
    }
  },
  watch: {
    '$route.path': {
      handler(newPath) {
        this.activeMenu = newPath
        if (this.isMobile) this.sidebarOpen = false
      }
    }
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
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
  z-index: 3;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

@media (max-width: 900px) {
  .app-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 2;
    box-shadow: 2px 0 8px rgba(0,0,0,0.08);
    background: #f5f7fa;
    transition: transform 0.3s cubic-bezier(.7,.3,.3,1);
    transform: translateX(-100%);
    padding-top: 60px;
    overflow-x: hidden;
  }
  .app-sidebar.open {
    transform: translateX(0);
  }
  .sidebar-toggle {
    display: inline-block;
  }
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
  padding: 0px;
  background-color: #f5f7fa;
}
</style>
