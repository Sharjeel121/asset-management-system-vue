<template>
  <div class="clients-container">

    <div class="header-actions">
      <div class="left-actions">
        
        <el-button type="primary" @click="showAddDialog">
          <el-icon><plus /></el-icon>
          New Client
        </el-button>
        <el-button @click="exportClients">
          <el-icon><download /></el-icon>
          Export
        </el-button>
      </div>
      <div class="right-actions ">
        <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
        <!-- <el-dropdown>
          <el-button size="medium">
            Filter <el-icon><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>All Countries</el-dropdown-item>
              <el-dropdown-item>France</el-dropdown-item>
              <el-dropdown-item>Germany</el-dropdown-item>
              <el-dropdown-item>Italy</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
      </div>
    </div>

    <el-card class="clients-card">
      <el-table
        :data="pagedClients"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="client_name" label="Client Name" min-width="130" />
        <el-table-column prop="headquarters_address" label="Headquarters Address" min-width="150" />
        <el-table-column prop="city" label="City" />
        <el-table-column prop="country" label="Country" />
        <el-table-column prop="phone_number" label="Phone Number" min-width="130" />
        <el-table-column prop="contact_person_name" label="Contact Name" min-width="130" />
        <el-table-column prop="contact_person_email" label="Contact Email" min-width="130" />
        <el-table-column prop="contact_person_phone_number" label="Contact Phone" min-width="130" />
        <el-table-column label="Actions" width="140">
          <template #default="scope">
            <el-button-group>
              <!-- <el-button size="small" @click="viewClient(scope.row)">View</el-button> -->
              <el-button type="primary" size="small" @click="showEditDialog(scope.row)">Edit</el-button>
              <el-button type="danger" size="small" @click="confirmDelete(scope.row)">Delete</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredClients.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
        />
      </div>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form
        ref="clientForm"
        :model="clientForm"
        :rules="rules"
        label-width="165px"
      >
        <el-form-item label="Client Name" prop="client_name">
          <el-input v-model="clientForm.client_name" />
        </el-form-item>
        <el-form-item label="Headquarters Address" prop="headquarters_address">
          <el-input v-model="clientForm.headquarters_address" />
        </el-form-item>
        <el-form-item label="Country" prop="country">
          <country-select class="custom-select" v-model="clientForm.country" :country="clientForm.country" topCountry="US" />        
        </el-form-item>
        <el-form-item label="City" prop="city">
          <region-select class="custom-select" v-model="clientForm.city" :country="clientForm.country" :region="clientForm.city" />
        </el-form-item>
        <el-form-item label="Phone Number" prop="phone_number">
          <el-input v-model="clientForm.phone_number" />
        </el-form-item>
        <el-form-item label="Contact Name" prop="contact_person_name">
          <el-input v-model="clientForm.contact_person_name" />
        </el-form-item>
        <el-form-item label="Contact Email" prop="contact_person_email">
          <el-input v-model="clientForm.contact_person_email" />
        </el-form-item>
        <el-form-item label="Contact Phone" prop="contact_person_phone_number">
          <el-input v-model="clientForm.contact_person_phone_number" />
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
import { useClientsStore } from '@/stores/clients'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ClientsView',
  data() {
    return {
      loading: false,
      clients: [],
      dialogVisible: false,
      isEdit: false,
      currentClientId: null,
      clientForm: {
        client_name: '',
        headquarters_address: '',
        city: '',
        country: '',
        phone_number: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_phone_number: ''
      },
      rules: {
        client_name: [
          { required: true, message: 'Please enter client name', trigger: 'blur' }
        ],
        headquarters_address: [
          { required: true, message: 'Please enter headquarters address', trigger: 'blur' }
        ],
        city: [
          { required: true, message: 'Please enter city', trigger: 'blur' }
        ],
        country: [
          { required: true, message: 'Please enter country', trigger: 'blur' }
        ],
        phone_number: [
          { required: true, message: 'Please enter phone number', trigger: 'blur' }
        ],
        // contact_person_name: [
        //   { required: true, message: 'Please enter contact name', trigger: 'blur' }
        // ],
        // contact_person_email: [
        //   { required: true, message: 'Please enter contact email', trigger: 'blur' },
        //   { type: 'email', message: 'Please enter valid email', trigger: 'blur' }
        // ],
        // contact_person_phone_number: [
        //   { required: true, message: 'Please enter contact phone', trigger: 'blur' }
        // ]
      },
      search: '',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Client' : 'Add New Client'
    },
    filteredClients() {
      if (!this.search) return this.clients
      return this.clients.filter(client =>
        client.client_name.toLowerCase().includes(this.search.toLowerCase()) ||
        client.country.toLowerCase().includes(this.search.toLowerCase()) ||
        (client.contact_person_name && client.contact_person_name.toLowerCase().includes(this.search.toLowerCase()))
      )
    },
    pagedClients() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredClients.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchClients() {
      this.loading = true
      try {
        const clientsStore = useClientsStore()
        await clientsStore.fetchClients()
        this.clients = clientsStore.clients
      } catch (error) {
        console.error('Failed to fetch clients: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.currentClientId = null
      this.clientForm = {
        client_name: '',
        headquarters_address: '',
        city: '',
        country: '',
        phone_number: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_phone_number: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(client) {
      this.isEdit = true
      this.currentClientId = client.id
      this.clientForm = { ...client }
      this.dialogVisible = true
    },
    viewClient(client) {
      ElMessage.info(`Viewing client: ${client.client_name}`)
    },
    exportClients() {
      ElMessage.success('Exported clients!')
    },
    async handleSubmit() {
      if (!this.$refs.clientForm) return
      
      try {
        await this.$refs.clientForm.validate()
        const clientsStore = useClientsStore()
        
        if (this.isEdit) {
          await clientsStore.updateClient(this.currentClientId, this.clientForm)
          ElMessage.success('Client updated successfully')
        } else {
          await clientsStore.createClient(this.clientForm)
          ElMessage.success('Client created successfully')
        }
        this.dialogVisible = false
        // this.fetchClients()
      } catch (error) {
        console.error('Failed to save client: ' + error.message)
      }
    },
    async confirmDelete(client) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this client?',
          'Warning',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        const clientsStore = useClientsStore()
        await clientsStore.deleteClient(client.id)
        ElMessage.success('Client deleted successfully')
        this.fetchClients()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to delete client: ' + error.message)
        }
      }
    }
  },
  mounted() {
    this.fetchClients()
  }
}
</script>

<style scoped>
.custom-select{
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border-color: #dcdfe6;
}
.clients-container {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}
.left-actions {
  display: flex;
  gap: 10px;
}
.right-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.search-input {
  width: 200px;
}
.clients-card {
  margin-top: 0;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style> 