<template>
  <div class="workstations-container">
    <div class="header-actions">
      <el-button type="primary" @click="showAddDialog">
        <el-icon><plus /></el-icon>
        New Workstation
      </el-button>
      <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
    </div>
    <el-card class="workstations-card">
      <el-table :data="pagedWorkstations" style="width: 100%" v-loading="loading">
        <el-table-column prop="workstationId" label="Workstation ID" min-width="100" />
        <el-table-column prop="description" label="Description" min-width="180" />
        <el-table-column prop="type" label="Type" min-width="100" />
        <el-table-column prop="processor" label="Processor" min-width="100" />
        <el-table-column prop="ram" label="RAM (GB)" min-width="100" />
        <el-table-column prop="os" label="Operating System" min-width="100" />
        <el-table-column prop="manufacturer" label="Manufacturer" min-width="120" />
        <el-table-column prop="model" label="Model" min-width="100" />
        <el-table-column prop="year" label="Year" min-width="60" />
        <el-table-column prop="formFactor" label="Form Factor" min-width="100" />
        <el-table-column prop="supplier" label="Supplier" min-width="100" />
        <el-table-column prop="site" label="Production Site" min-width="130" />
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
          :total="filteredWorkstations.length"
          :page-size="pageSize"
          :current-page.sync="currentPage"
        />
      </div>
    </el-card>
    <!-- Add/Edit Dialog -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form ref="workstationForm" :model="workstationForm" :rules="rules" label-width="140px">
        <el-form-item label="Workstation ID" prop="workstationId">
          <el-input v-model="workstationForm.workstationId" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="workstationForm.description" />
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="workstationForm.type" placeholder="Select type">
            <el-option label="Server" value="Server" />
            <el-option label="Workstation" value="Workstation" />
          </el-select>
        </el-form-item>
        <el-form-item label="Processor" prop="processor">
          <el-input v-model="workstationForm.processor" />
        </el-form-item>
        <el-form-item label="RAM (GB)" prop="ram">
          <el-input-number v-model="workstationForm.ram" :min="1" />
        </el-form-item>
        <el-form-item label="Operating System" prop="os">
          <el-input v-model="workstationForm.os" />
        </el-form-item>
        <el-form-item label="Manufacturer" prop="manufacturer">
          <el-input v-model="workstationForm.manufacturer" />
        </el-form-item>
        <el-form-item label="Model" prop="model">
          <el-input v-model="workstationForm.model" />
        </el-form-item>
        <el-form-item label="Year" prop="year">
          <el-input-number v-model="workstationForm.year" :min="1990" :max="2100" />
        </el-form-item>
        <el-form-item label="Form Factor" prop="formFactor">
          <el-select v-model="workstationForm.formFactor" placeholder="Select form factor">
            <el-option label="Tower" value="Tower" />
            <el-option label="Rack-mountable blade" value="Rack-mountable blade" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
        <el-form-item label="Supplier" prop="supplier">
          <el-select v-model="workstationForm.supplier" placeholder="Select supplier">
            <el-option label="CSI" value="CSI" />
            <el-option label="CLIENT" value="CLIENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="Production Site" prop="site">
          <el-select v-model="workstationForm.site" filterable placeholder="Select site">
            <el-option v-for="site in sites" :key="site" :label="site" :value="site" />
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
  name: 'ComputerWorkstationsView',
  data() {
    return {
      loading: false,
      workstations: [],
      sites: ['Paris Factory', 'Berlin Factory', 'Lyon Distribution Center'],
      dialogVisible: false,
      isEdit: false,
      workstationForm: {
        workstationId: '',
        description: '',
        type: '',
        processor: '',
        ram: 1,
        os: '',
        manufacturer: '',
        model: '',
        year: 2024,
        formFactor: '',
        supplier: '',
        site: ''
      },
      rules: {
        workstationId: [{ required: true, message: 'Please enter workstation ID', trigger: 'blur' }],
        description: [{ required: true, message: 'Please enter description', trigger: 'blur' }],
        type: [{ required: true, message: 'Please select type', trigger: 'change' }],
        processor: [{ required: true, message: 'Please enter processor', trigger: 'blur' }],
        ram: [{ required: true, message: 'Please enter RAM', trigger: 'blur', type: 'number', min: 1 }],
        os: [{ required: true, message: 'Please enter operating system', trigger: 'blur' }],
        manufacturer: [{ required: true, message: 'Please enter manufacturer', trigger: 'blur' }],
        model: [{ required: true, message: 'Please enter model', trigger: 'blur' }],
        year: [{ required: true, message: 'Please enter year', trigger: 'blur', type: 'number', min: 1990, max: 2100 }],
        formFactor: [{ required: true, message: 'Please select form factor', trigger: 'change' }],
        supplier: [{ required: true, message: 'Please select supplier', trigger: 'change' }],
        site: [{ required: true, message: 'Please select production site', trigger: 'change' }]
      },
      search: '',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Workstation' : 'Add New Workstation'
    },
    filteredWorkstations() {
      if (!this.search) return this.workstations
      return this.workstations.filter(item =>
        item.workstationId.toLowerCase().includes(this.search.toLowerCase()) ||
        item.site.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    pagedWorkstations() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredWorkstations.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchWorkstations() {
      this.loading = true
      try {
        // TODO: Replace with API call
        this.workstations = [
          { workstationId: 'WS-001', description: 'Main Server', type: 'Server', processor: 'Intel Xeon E5', ram: 32, os: 'Windows Server 2019', manufacturer: 'Dell', model: 'PowerEdge R740', year: 2022, formFactor: 'Rack-mountable blade', supplier: 'CSI', site: 'Paris Factory' },
          { workstationId: 'WS-002', description: 'Operator Workstation', type: 'Workstation', processor: 'Intel i7', ram: 16, os: 'Windows 10', manufacturer: 'HP', model: 'Z2 Mini', year: 2021, formFactor: 'Tower', supplier: 'CLIENT', site: 'Berlin Factory' }
        ]
      } finally {
        this.loading = false
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.workstationForm = {
        workstationId: '',
        description: '',
        type: '',
        processor: '',
        ram: 1,
        os: '',
        manufacturer: '',
        model: '',
        year: 2024,
        formFactor: '',
        supplier: '',
        site: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(item) {
      this.isEdit = true
      this.workstationForm = { ...item }
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        await this.$refs.workstationForm.validate()
        // TODO: Implement API call
        if (this.isEdit) {
          // Update workstation
        } else {
          // Create new workstation
        }
        this.dialogVisible = false
        this.fetchWorkstations()
      } catch (error) {
        console.error('Form validation failed:', error)
      }
    },
    confirmDelete(item) {
      this.$confirm(
        'This will permanently delete the workstation. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        // TODO: Implement delete
        this.$message.success('Workstation deleted')
        this.fetchWorkstations()
      })
    }
  },
  mounted() {
    this.fetchWorkstations()
  }
}
</script>

<style scoped>
.workstations-container {
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
.workstations-card {
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