import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import UsersView from '@/views/UsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/clients',
      name: 'clients',
      component: () => import('../views/ClientsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/production-sites',
      name: 'production-sites',
      component: () => import('../views/ProductionSitesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/control-cabinets',
      name: 'control-cabinets',
      component: () => import('../views/ControlCabinetsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/manufacturers',
      name: 'manufacturers',
      component: () => import('../views/ManufacturersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/computer-workstations',
      name: 'computer-workstations',
      component: () => import('../views/ComputerWorkstationsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/automation-products',
      name: 'automation-products',
      component: () => import('../views/AutomationProductsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/software',
      name: 'software',
      component: () => import('../views/SoftwareView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // Redirect to home if user is logged in and trying to access login page
  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/home')
    return
  }
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router 