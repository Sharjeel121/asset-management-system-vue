<template>
  <div class="manufacturers-container">
    <div class="header-actions">
      <el-button type="primary" @click="showAddDialog">
        <el-icon><plus /></el-icon>
        New Manufacturer
      </el-button>
      <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
    </div>
    <el-card class="manufacturers-card">
      <el-table :data="pagedManufacturers" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="Name" min-width="120" />
        <el-table-column prop="address" label="Headquarters Address" min-width="180" />
        <el-table-column prop="country" label="Country" min-width="80" />
        <el-table-column prop="productRange" label="Product Range" min-width="130" />
        <el-table-column prop="contact" label="Contact" min-width="130" />
        <el-table-column prop="email" label="Email" min-width="130" />
        <el-table-column prop="phone" label="Phone" min-width="130" />
        <el-table-column label="Actions" min-width="130">
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
          :total="filteredManufacturers.length"
          :page-size="pageSize"
          :current-page.sync="currentPage"
        />
      </div>
    </el-card>
    <!-- Add/Edit Dialog -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form ref="manufacturerForm" :model="manufacturerForm" :rules="rules" label-width="140px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="manufacturerForm.name" />
        </el-form-item>
        <el-form-item label="Headquarters Address" prop="address">
          <el-input v-model="manufacturerForm.address" />
        </el-form-item>
        <el-form-item label="Country" prop="country">
          <el-input v-model="manufacturerForm.country" />
        </el-form-item>
        <el-form-item label="Product Range" prop="productRange">
          <el-input v-model="manufacturerForm.productRange" />
        </el-form-item>
        <el-form-item label="Contact" prop="contact">
          <el-input v-model="manufacturerForm.contact" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="manufacturerForm.email" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="manufacturerForm.phone" />
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
  name: 'ManufacturersView',
  data() {
    return {
      loading: false,
      manufacturers: [],
      dialogVisible: false,
      isEdit: false,
      manufacturerForm: {
        name: '',
        address: '',
        country: '',
        productRange: '',
        contact: '',
        email: '',
        phone: ''
      },
      rules: {
        name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
        address: [{ required: true, message: 'Please enter headquarters address', trigger: 'blur' }],
        country: [{ required: true, message: 'Please enter country', trigger: 'blur' }],
        productRange: [{ required: true, message: 'Please enter product range', trigger: 'blur' }],
        contact: [{ required: true, message: 'Please enter contact', trigger: 'blur' }],
        email: [
          { required: true, message: 'Please enter email', trigger: 'blur' },
          { type: 'email', message: 'Please enter valid email', trigger: 'blur' }
        ],
        phone: [{ required: true, message: 'Please enter phone', trigger: 'blur' }]
      },
      search: '',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Manufacturer' : 'Add New Manufacturer'
    },
    filteredManufacturers() {
      if (!this.search) return this.manufacturers
      return this.manufacturers.filter(item =>
        item.name.toLowerCase().includes(this.search.toLowerCase()) ||
        item.country.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    pagedManufacturers() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredManufacturers.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchManufacturers() {
      this.loading = true
      try {
        // TODO: Replace with API call
        this.manufacturers = [
          { name: 'Siemens', address: 'Werner-von-Siemens-Str. 1, Munich', country: 'Germany', productRange: 'PLC, HMI, Drives', contact: 'Anna Schmidt', email: 'anna@siemens.com', phone: '+49 123 4567' },
          { name: 'Schneider', address: '35 Rue Joseph Monier, Rueil-Malmaison', country: 'France', productRange: 'PLC, Switches', contact: 'Jean Martin', email: 'jean@schneider.com', phone: '+33 987 6543' },
          { name: 'Allen-Bradley', address: '1201 S 2nd St, Milwaukee', country: 'USA', productRange: 'PLC, Controllers', contact: 'Mike Johnson', email: 'mike@ab.com', phone: '+1 555 1234' }
        ]
      } finally {
        this.loading = false
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.manufacturerForm = {
        name: '',
        address: '',
        country: '',
        productRange: '',
        contact: '',
        email: '',
        phone: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(item) {
      this.isEdit = true
      this.manufacturerForm = { ...item }
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        await this.$refs.manufacturerForm.validate()
        // TODO: Implement API call
        if (this.isEdit) {
          // Update manufacturer
        } else {
          // Create new manufacturer
        }
        this.dialogVisible = false
        this.fetchManufacturers()
      } catch (error) {
        console.error('Form validation failed:', error)
      }
    },
    confirmDelete(item) {
      this.$confirm(
        'This will permanently delete the manufacturer. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        // TODO: Implement delete
        this.$message.success('Manufacturer deleted')
        this.fetchManufacturers()
      })
    }
  },
  mounted() {
    this.fetchManufacturers()
  }
}
</script>

<style scoped>
.manufacturers-container {
  padding: 20px;
}
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
}
.search-input {
  width: 200px;
}
.manufacturers-card {
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