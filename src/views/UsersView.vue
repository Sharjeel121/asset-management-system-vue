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
        <el-table-column prop="firstName" label="First Name" />
        <el-table-column prop="lastName" label="Last Name" />
        <el-table-column prop="loginId" label="Login ID" />
        <el-table-column prop="role" label="Role">
          <template #default="{ row }">
            <el-tag :type="row.role === 'Administrator' ? 'danger' : 'info'">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Created At">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleDateString() }}
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
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model="form.firstName" />
        </el-form-item>
        <el-form-item label="Last Name" prop="lastName">
          <el-input v-model="form.lastName" />
        </el-form-item>
        <el-form-item label="Login ID" prop="loginId">
          <el-input v-model="form.loginId" />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="Administrator" value="Administrator" />
            <el-option label="Standard User" value="Standard User" />
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { ElMessage, ElMessageBox } from 'element-plus'

const usersStore = useUsersStore()
const users = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const formRef = ref(null)
const isEdit = ref(false)
const currentUserId = ref(null)

const form = ref({
  firstName: '',
  lastName: '',
  loginId: '',
  role: 'Standard User'
})

const rules = {
  firstName: [
    { required: true, message: 'Please enter first name', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Please enter last name', trigger: 'blur' }
  ],
  loginId: [
    { required: true, message: 'Please enter login ID', trigger: 'blur' }
  ],
  role: [
    { required: true, message: 'Please select role', trigger: 'change' }
  ]
}

const dialogTitle = computed(() => 
  isEdit.value ? 'Edit User' : 'Add New User'
)

const fetchUsers = async () => {
  loading.value = true
  try {
    await usersStore.fetchUsers()
    users.value = usersStore.users
  } catch (error) {
    ElMessage.error('Failed to fetch users: ' + error.message)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  currentUserId.value = null
  form.value = {
    firstName: '',
    lastName: '',
    loginId: '',
    role: 'Standard User'
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  currentUserId.value = row.id
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (row) => {
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
    await usersStore.deleteUser(row.id)
    ElMessage.success('User deleted successfully')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete user: ' + error.message)
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    if (isEdit.value) {
      await usersStore.updateUser(currentUserId.value, form.value)
      ElMessage.success('User updated successfully')
    } else {
      await usersStore.createUser(form.value)
      ElMessage.success('User created successfully')
    }
    dialogVisible.value = false
    fetchUsers()
  } catch (error) {
    ElMessage.error('Failed to save user: ' + error.message)
  }
}

onMounted(() => {
  fetchUsers()
})
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