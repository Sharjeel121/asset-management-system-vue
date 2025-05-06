<template>
  <div class="software-container">
    <div class="header-actions">
      <el-button type="primary" @click="showAddDialog">
        <el-icon><plus /></el-icon>
        New Software
      </el-button>
      <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
    </div>
    <el-card class="software-card">
      <el-table :data="pagedSoftware" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="Name" min-width="130" />
        <el-table-column prop="manufacturer" label="Manufacturer" min-width="120" />
        <el-table-column prop="function" label="Function" min-width="100" />
        <el-table-column prop="license" label="License" min-width="100" />
        <el-table-column prop="supplier" label="Supplier" min-width="100" />
        <el-table-column prop="workstation" label="Workstation" min-width="100" />
        <el-table-column prop="site" label="Site" />
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
          :total="filteredSoftware.length"
          :page-size="pageSize"
          :current-page.sync="currentPage"
        />
      </div>
    </el-card>
    <!-- Add/Edit Dialog -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form ref="softwareForm" :model="softwareForm" :rules="rules" label-width="140px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="softwareForm.name" />
        </el-form-item>
        <el-form-item label="Manufacturer" prop="manufacturer">
          <el-select v-model="softwareForm.manufacturer" filterable placeholder="Select manufacturer">
            <el-option v-for="m in manufacturers" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="Function" prop="function">
          <el-select v-model="softwareForm.function" placeholder="Select function">
            <el-option label="SCADA" value="SCADA" />
            <el-option label="HMI" value="HMI" />
            <el-option label="PLC Programming" value="PLC Programming" />
            <el-option label="MES" value="MES" />
            <el-option label="Database" value="Database" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
        <el-form-item label="License" prop="license">
          <el-input v-model="softwareForm.license" />
        </el-form-item>
        <el-form-item label="Supplier" prop="supplier">
          <el-select v-model="softwareForm.supplier" placeholder="Select supplier">
            <el-option label="CSI" value="CSI" />
            <el-option label="CLIENT" value="CLIENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="Workstation" prop="workstation">
          <el-select v-model="softwareForm.workstation" filterable placeholder="Select workstation">
            <el-option v-for="ws in workstations" :key="ws.workstationId" :label="ws.workstationId" :value="ws.workstationId" />
          </el-select>
        </el-form-item>
        <el-form-item label="Site" prop="site">
          <el-select v-model="softwareForm.site" filterable placeholder="Select site">
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
  name: 'SoftwareView',
  data() {
    return {
      loading: false,
      software: [],
      manufacturers: ['Siemens', 'Schneider', 'Allen-Bradley', 'Rockwell', 'SAP', 'Microsoft'],
      workstations: [],
      sites: ['Paris Factory', 'Berlin Factory', 'Lyon Distribution Center'],
      dialogVisible: false,
      isEdit: false,
      softwareForm: {
        name: '',
        manufacturer: '',
        function: '',
        license: '',
        supplier: '',
        workstation: '',
        site: ''
      },
      rules: {
        name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
        manufacturer: [{ required: true, message: 'Please select manufacturer', trigger: 'change' }],
        function: [{ required: true, message: 'Please select function', trigger: 'change' }],
        license: [{ required: true, message: 'Please enter license', trigger: 'blur' }],
        supplier: [{ required: true, message: 'Please select supplier', trigger: 'change' }],
        workstation: [{ required: true, message: 'Please select workstation', trigger: 'change' }],
        site: [{ required: true, message: 'Please select site', trigger: 'change' }]
      },
      search: '',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Software' : 'Add New Software'
    },
    filteredSoftware() {
      if (!this.search) return this.software
      return this.software.filter(item =>
        item.name.toLowerCase().includes(this.search.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(this.search.toLowerCase()) ||
        item.site.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    pagedSoftware() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredSoftware.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchSoftware() {
      this.loading = true
      try {
        // TODO: Replace with API call
        this.software = [
          { name: 'WinCC', manufacturer: 'Siemens', function: 'SCADA', license: 'ABC123', supplier: 'CSI', workstation: 'WS-001', site: 'Paris Factory' },
          { name: 'FactoryTalk View', manufacturer: 'Rockwell', function: 'HMI', license: 'XYZ789', supplier: 'CLIENT', workstation: 'WS-002', site: 'Berlin Factory' },
          { name: 'TIA Portal', manufacturer: 'Siemens', function: 'PLC Programming', license: 'LMN456', supplier: 'CSI', workstation: 'WS-001', site: 'Paris Factory' }
        ]
      } finally {
        this.loading = false
      }
    },
    async fetchWorkstations() {
      try {
        // TODO: Replace with API call
        this.workstations = [
          { workstationId: 'WS-001', description: 'Main Server', site: 'Paris Factory' },
          { workstationId: 'WS-002', description: 'Operator Workstation', site: 'Berlin Factory' }
        ]
      } catch (error) {
        console.error('Failed to fetch workstations:', error)
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.softwareForm = {
        name: '',
        manufacturer: '',
        function: '',
        license: '',
        supplier: '',
        workstation: '',
        site: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(item) {
      this.isEdit = true
      this.softwareForm = { ...item }
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        await this.$refs.softwareForm.validate()
        // TODO: Implement API call
        if (this.isEdit) {
          // Update software
        } else {
          // Create new software
        }
        this.dialogVisible = false
        this.fetchSoftware()
      } catch (error) {
        console.error('Form validation failed:', error)
      }
    },
    confirmDelete(item) {
      this.$confirm(
        'This will permanently delete the software. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        // TODO: Implement delete
        this.$message.success('Software deleted')
        this.fetchSoftware()
      })
    }
  },
  mounted() {
    this.fetchSoftware()
    this.fetchWorkstations()
  }
}
</script>

<style scoped>
.software-container {
  padding: 20px;
}
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
}
.software-card {
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