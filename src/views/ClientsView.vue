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
        <el-dropdown>
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
        </el-dropdown>
      </div>
    </div>

    <el-card class="clients-card">
      <el-table
        :data="pagedClients"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="name" label="Client Name" min-width="130" />
        <el-table-column prop="address" label="Headquarters Address" min-width="150" />
        <el-table-column prop="city" label="City" />
        <el-table-column prop="country" label="Country" />
        <el-table-column prop="phone" label="Phone Number" min-width="130" />
        <el-table-column prop="contactPerson" label="Contact Name" min-width="130" />
        <el-table-column prop="contactEmail" label="Contact Email" min-width="130" />
        <el-table-column prop="contactPhone" label="Contact Phone" min-width="130" />
        <el-table-column label="Actions" width="180">
          <template #default="scope">
            <el-button-group>
              <el-button size="small" @click="viewClient(scope.row)">View</el-button>
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
          :current-page.sync="currentPage"
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
        label-width="140px"
      >
        <el-form-item label="Client Name" prop="name">
          <el-input v-model="clientForm.name" />
        </el-form-item>
        <el-form-item label="Headquarters Address" prop="address">
          <el-input v-model="clientForm.address" />
        </el-form-item>
        <el-form-item label="City" prop="city">
          <el-input v-model="clientForm.city" />
        </el-form-item>
        <el-form-item label="Country" prop="country">
          <el-input v-model="clientForm.country" />
        </el-form-item>
        <el-form-item label="Phone Number" prop="phone">
          <el-input v-model="clientForm.phone" />
        </el-form-item>
        <el-form-item label="Contact Name" prop="contactPerson">
          <el-input v-model="clientForm.contactPerson" />
        </el-form-item>
        <el-form-item label="Contact Email" prop="contactEmail">
          <el-input v-model="clientForm.contactEmail" />
        </el-form-item>
        <el-form-item label="Contact Phone" prop="contactPhone">
          <el-input v-model="clientForm.contactPhone" />
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
export default {
  name: 'ClientsView',
  data() {
    return {
      loading: false,
      clients: [],
      dialogVisible: false,
      isEdit: false,
      clientForm: {
        name: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please enter client name', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'Please enter headquarters address', trigger: 'blur' }
        ],
        city: [
          { required: true, message: 'Please enter city', trigger: 'blur' }
        ],
        country: [
          { required: true, message: 'Please enter country', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'Please enter phone number', trigger: 'blur' }
        ],
        contactPerson: [
          { required: true, message: 'Please enter contact name', trigger: 'blur' }
        ],
        contactEmail: [
          { required: true, message: 'Please enter contact email', trigger: 'blur' },
          { type: 'email', message: 'Please enter valid email', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: 'Please enter contact phone', trigger: 'blur' }
        ]
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
        client.name.toLowerCase().includes(this.search.toLowerCase()) ||
        client.country.toLowerCase().includes(this.search.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(this.search.toLowerCase())
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
        // TODO: Implement API call
        this.clients = [
          {
            id: 1,
            name: 'Acme Industries',
            address: 'HQ 1, Paris',
            city: 'Paris',
            country: 'France',
            phone: '+33 123 4567',
            contactPerson: 'Jean Dupont',
            contactEmail: 'jean@acme.com',
            contactPhone: '+33 987 6543'
          },
          {
            id: 2,
            name: 'TechCorp Global',
            address: 'HQ 2, Berlin',
            city: 'Berlin',
            country: 'Germany',
            phone: '+49 123 4567',
            contactPerson: 'Hans Müller',
            contactEmail: 'hans@techcorp.com',
            contactPhone: '+49 987 6543'
          }
        ]
      } finally {
        this.loading = false
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.clientForm = {
        name: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(client) {
      this.isEdit = true
      this.clientForm = { ...client }
      this.dialogVisible = true
    },
    viewClient(client) {
      // TODO: Implement view client details
      this.$message.info(`Viewing client: ${client.name}`)
    },
    exportClients() {
      // TODO: Implement export functionality
      this.$message.success('Exported clients!')
    },
    async handleSubmit() {
      try {
        await this.$refs.clientForm.validate()
        // TODO: Implement API call
        if (this.isEdit) {
          // Update client
        } else {
          // Create new client
        }
        this.dialogVisible = false
        this.fetchClients()
      } catch (error) {
        console.error('Form validation failed:', error)
      }
    },
    confirmDelete(client) {
      this.$confirm(
        'This will permanently delete the client. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        // TODO: Implement delete
        this.$message.success('Client deleted')
        this.fetchClients()
      })
    }
  },
  mounted() {
    this.fetchClients()
  }
}
</script>

<style scoped>
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