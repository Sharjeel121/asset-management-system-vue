<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>Asset Management System</h2>
          <p>Industrial Automation Asset Management</p>
        </div>
      </template>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="Login ID" prop="loginId">
          <el-input
            v-model="loginForm.loginId"
            placeholder="Enter your login ID"
            prefix-icon="user"
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
            prefix-icon="lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            class="login-button"
          >
            Login
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        loginId: '',
        password: ''
      },
      loading: false,
      rules: {
        loginId: [
          { required: true, message: 'Please enter your login ID', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter your password', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      try {
        const authStore = useAuthStore()
        const success = await authStore.login(this.loginForm)
        if (success) {
          this.$router.push('/home')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1976d2 0%, #64b5f6 100%);
  overflow: hidden;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
}

@media (max-width: 500px) {
  .login-card {
    max-width: 95vw;
    padding: 16px 4px;
  }
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #1976d2;
  font-size: 24px;
}

.card-header p {
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
}

.login-button {
  width: 100%;
  margin-top: 20px;
}
</style> 