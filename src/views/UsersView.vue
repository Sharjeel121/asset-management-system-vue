<template>
  <div class="users-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>User Management</span>
          <el-button type="primary" @click="handleAdd">Add New User</el-button>
        </div>
      </template>

      <el-table :data="users" v-loading="loading" style="width: 100%">
        <el-table-column prop="first_name" label="First Name" min-width="100" />
        <el-table-column prop="last_name" label="Last Name" min-width="100" />
        <el-table-column prop="user_name" label="User Name" min-width="100" />
        <el-table-column prop="email" label="Email" min-width="180" />
        <el-table-column prop="role" label="Role" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'administrator' ? 'success' : 'info'">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="Created At" min-width="100">
          <template #default="{ row }">
            {{ new Date(row.created_at).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleEdit(row)">
                Edit
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
                Delete
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit User Dialog -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="First Name" prop="first_name">
          <el-input v-model="form.first_name" />
        </el-form-item>
        <el-form-item label="Last Name" prop="last_name">
          <el-input v-model="form.last_name" />
        </el-form-item>
        <el-form-item label="User Name" prop="user_name">
          <el-input v-model="form.user_name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="Administrator" value="administrator" />
            <el-option label="User" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isEdit ? 'Update' : 'Create' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useUsersStore } from '@/stores/users'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'UsersView',
  
  data() {
    return {
      users: [],
      loading: false,
      dialogVisible: false,
      isEdit: false,
      currentUserId: null,
      form: {
        first_name: '',
        last_name: '',
        user_name: '',
        email: '',
        role: '',
        password: '',
      },
      rules: {
        first_name: [
          { required: true, message: 'Please enter first name', trigger: 'blur' }
        ],
        last_name: [
          { required: true, message: 'Please enter last name', trigger: 'blur' }
        ],
        user_name: [
          { required: true, message: 'Please enter user name', trigger: 'blur' }
        ],
        role: [
          { required: true, message: 'Please select role', trigger: 'change' }
        ],
        email: [
          { required: true, message: 'Please enter email', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter password', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit User' : 'Add New User'
    }
  },

  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        const usersStore = useUsersStore()
        if (usersStore.users.length === 0){
          await usersStore.fetchUsers()
        }
        this.users = usersStore.users
      } catch (error) {
        ElMessage.error('Failed to fetch users: ' + error.message)
      } finally {
        this.loading = false
      }
    },

    handleAdd() {
      this.isEdit = false
      this.currentUserId = null
      this.form = {
        first_name: '',
        last_name: '',
        user_name: '',
        role: '',
        email: '',
        password: ''
      }
      this.dialogVisible = true
    },

    handleEdit(row) {
      this.isEdit = true
      this.currentUserId = row.id
      this.form = { ...row }
      this.dialogVisible = true
    },

    async handleDelete(row) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this user?',
          'Warning',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        const usersStore = useUsersStore()
        await usersStore.deleteUser(row.id)
        ElMessage.success('User deleted successfully')
        // this.fetchUsers()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to delete user: ' + error.message)
        }
      }
    },

    async handleSubmit() {
      if (!this.$refs.formRef) return
      
      try {
        await this.$refs.formRef.validate()
        const usersStore = useUsersStore()
        
        if (this.isEdit) {
          await usersStore.updateUser(this.currentUserId, this.form)
          ElMessage.success('User updated successfully')
        } else {
          // console.log("🚀 ~ handleSubmit ~ this.form:", this.form)
          await usersStore.createUser(this.form)
          ElMessage.success('User created successfully')
        }
        this.dialogVisible = false
        // this.fetchUsers() //uncomment this
      } catch (error) {
        ElMessage.error('Failed to save user: ' + error.message)
      }
    }
  },

  mounted() {
    this.fetchUsers()
  }
}
</script>

<style scoped>
.users-view {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 