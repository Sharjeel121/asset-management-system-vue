<template>
  <div class="sites-container">
    <div class="header-actions">
      <el-button type="primary" @click="showAddDialog">
        <el-icon><plus /></el-icon>
        New Site
      </el-button>
      <el-input v-model="search" placeholder="Search..." size="small" class="search-input" clearable />
    </div>
    <el-card class="sites-card">
      <el-table :data="pagedSites" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="Site Name" />
        <el-table-column prop="address" label="Address" />
        <el-table-column prop="city" label="City" />
        <el-table-column prop="country" label="Country" />
        <el-table-column prop="contactName" label="Contact Name" />
        <el-table-column prop="contactEmail" label="Contact Email" />
        <el-table-column prop="contactPhone" label="Contact Phone" />
        <el-table-column prop="client" label="Client" />
        <el-table-column label="Actions" width="180">
          <template #default="scope">
            <el-button-group>
              <el-button size="small" @click="showEditDialog(scope.row)">Edit</el-button>
              <el-button type="danger" size="small" @click="confirmDelete(scope.row)">Delete</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredSites.length"
          :page-size="pageSize"
          :current-page.sync="currentPage"
        />
      </div>
    </el-card>
    <!-- Add/Edit Dialog -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form ref="siteForm" :model="siteForm" :rules="rules" label-width="140px">
        <el-form-item label="Site Name" prop="name">
          <el-input v-model="siteForm.name" />
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input v-model="siteForm.address" />
        </el-form-item>
        <el-form-item label="City" prop="city">
          <el-input v-model="siteForm.city" />
        </el-form-item>
        <el-form-item label="Country" prop="country">
          <el-input v-model="siteForm.country" />
        </el-form-item>
        <el-form-item label="Contact Name" prop="contactName">
          <el-input v-model="siteForm.contactName" />
        </el-form-item>
        <el-form-item label="Contact Email" prop="contactEmail">
          <el-input v-model="siteForm.contactEmail" />
        </el-form-item>
        <el-form-item label="Contact Phone" prop="contactPhone">
          <el-input v-model="siteForm.contactPhone" />
        </el-form-item>
        <el-form-item label="Client" prop="client">
          <el-select v-model="siteForm.client" filterable placeholder="Select client">
            <el-option v-for="client in clients" :key="client" :label="client" :value="client" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">{{ isEdit ? 'Update' : 'Create' }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProductionSitesView',
  data() {
    return {
      loading: false,
      sites: [],
      clients: ['Acme Industries', 'TechCorp Global', 'Electro Systems'],
      dialogVisible: false,
      isEdit: false,
      siteForm: {
        name: '',
        address: '',
        city: '',
        country: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        client: ''
      },
      rules: {
        name: [{ required: true, message: 'Please enter site name', trigger: 'blur' }],
        address: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
        city: [{ required: true, message: 'Please enter city', trigger: 'blur' }],
        country: [{ required: true, message: 'Please enter country', trigger: 'blur' }],
        contactName: [{ required: true, message: 'Please enter contact name', trigger: 'blur' }],
        contactEmail: [
          { required: true, message: 'Please enter contact email', trigger: 'blur' },
          { type: 'email', message: 'Please enter valid email', trigger: 'blur' }
        ],
        contactPhone: [{ required: true, message: 'Please enter contact phone', trigger: 'blur' }],
        client: [{ required: true, message: 'Please select client', trigger: 'change' }]
      },
      search: '',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Site' : 'Add New Site'
    },
    filteredSites() {
      if (!this.search) return this.sites
      return this.sites.filter(item =>
        item.name.toLowerCase().includes(this.search.toLowerCase()) ||
        item.client.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    pagedSites() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredSites.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchSites() {
      this.loading = true
      try {
        // TODO: Replace with API call
        this.sites = [
          { name: 'Paris Factory', address: '123 Rue de Paris', city: 'Paris', country: 'France', contactName: 'Jean Dupont', contactEmail: 'jean@acme.com', contactPhone: '+33 123 4567', client: 'Acme Industries' },
          { name: 'Berlin Factory', address: '456 Berliner Str.', city: 'Berlin', country: 'Germany', contactName: 'Hans Müller', contactEmail: 'hans@techcorp.com', contactPhone: '+49 987 6543', client: 'TechCorp Global' }
        ]
      } finally {
        this.loading = false
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.siteForm = {
        name: '',
        address: '',
        city: '',
        country: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        client: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(item) {
      this.isEdit = true
      this.siteForm = { ...item }
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        await this.$refs.siteForm.validate()
        // TODO: Implement API call
        if (this.isEdit) {
          // Update site
        } else {
          // Create new site
        }
        this.dialogVisible = false
        this.fetchSites()
      } catch (error) {
        console.error('Form validation failed:', error)
      }
    },
    confirmDelete(item) {
      this.$confirm(
        'This will permanently delete the site. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        // TODO: Implement delete
        this.$message.success('Site deleted')
        this.fetchSites()
      })
    }
  },
  mounted() {
    this.fetchSites()
  }
}
</script>

<style scoped>
.sites-container {
  padding: 20px;
}
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.search-input {
  width: 200px;
}
.sites-card {
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