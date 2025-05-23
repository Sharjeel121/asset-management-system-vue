<template>
  <div class="workstations-container">
    <div class="header-actions">
      <div class="left-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><plus /></el-icon>
          Add New Workstation
        </el-button>
        <el-button @click="exportWorkstations">
          <el-icon><download /></el-icon>
          Export
        </el-button>
      </div>
      <div class="right-actions">
        <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
      </div>
    </div>
    <el-card class="workstations-card">
      <el-table :data="pagedWorkstations" style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="workstation_id" label="Workstation ID" min-width="120" />
        <el-table-column prop="description" label="Description" min-width="180" />
        <el-table-column prop="type" label="Type" min-width="100" />
        <el-table-column prop="processor_specifications" label="Processor" min-width="150" />
        <el-table-column prop="ram" label="RAM" min-width="100" />
        <el-table-column prop="harddisk_capacity" label="Hard Disk" min-width="100" />
        <el-table-column prop="operating_system" label="Operating System" min-width="150" />
        <el-table-column prop="manufacturer.manufacturer_name" label="Manufacturer" min-width="150" />
        <el-table-column prop="model" label="Model" min-width="120" />
        <el-table-column prop="year" label="Year" min-width="80" />
        <el-table-column prop="form_factor" label="Form Factor" min-width="120" />
        <el-table-column prop="supplier" label="Supplier" min-width="100" />
        <el-table-column prop="production_site.site_name" label="Production Site" min-width="150" />
        <el-table-column label="Actions" width="140">
          <template #default="scope">
            <el-button-group>
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
          :total="filteredWorkstations.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
        />
      </div>
    </el-card>
    <!-- Add/Edit Dialog -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form ref="workstationForm" :model="workstationForm" :rules="rules" label-width="140px">
        <el-form-item label="Workstation ID" prop="workstation_id">
          <el-input v-model="workstationForm.workstation_id" />
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
        <el-form-item label="Processor" prop="processor_specifications">
          <el-input v-model="workstationForm.processor_specifications" />
        </el-form-item>
        <el-form-item label="RAM" prop="ram">
          <el-select v-model="workstationForm.ram" placeholder="Select RAM">
            <el-option v-for="ram in ramOptions" :key="ram" :label="ram" :value="ram" />
          </el-select>
        </el-form-item>
        <el-form-item label="Hard Disk" prop="harddisk_capacity">
          <el-select v-model="workstationForm.harddisk_capacity" placeholder="Select hard disk">
            <el-option v-for="disk in hardDiskOptions" :key="disk" :label="disk" :value="disk" />
          </el-select>
        </el-form-item>
        <el-form-item label="Operating System" prop="operating_system">
          <!-- <el-input v-model="workstationForm.operating_system" /> -->
          <el-select v-model="workstationForm.operating_system" filterable placeholder="Select windows">
            <el-option label="Windows 11" value="Windows 11" />
            <el-option label="Windows 10" value="Windows 10" />
            <el-option label="Windows 8" value="Windows 8" />
            <el-option label="Windows 7" value="Windows 7" />
          </el-select>
        </el-form-item>
        <el-form-item label="Manufacturer" prop="manufacturer_id">
          <el-select v-model="workstationForm.manufacturer_id" filterable placeholder="Select manufacturer">
            <el-option
              v-for="manufacturer in manufacturers"
              :key="manufacturer.id"
              :label="manufacturer.manufacturer_name"
              :value="manufacturer.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Model" prop="model">
          <el-input v-model="workstationForm.model" />
        </el-form-item>
        <el-form-item label="Year" prop="year">
          <el-input v-model="workstationForm.year" />
        </el-form-item>
        <el-form-item label="Form Factor" prop="form_factor">
          <el-select v-model="workstationForm.form_factor" placeholder="Select form factor">
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
        <el-form-item label="Production Site" prop="production_site_id">
          <el-select v-model="workstationForm.production_site_id" filterable placeholder="Select site">
            <el-option
              v-for="site in productionSites"
              :key="site.id"
              :label="site.site_name"
              :value="site.id"
            />
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
import { useComputerWorkstationsStore } from '@/stores/computerWorkstations'
import { useProductionSitesStore } from '@/stores/productionSites'
import { useManufacturersStore } from '@/stores/manufacturers'
import { ElMessage, ElMessageBox } from 'element-plus'
import appRequest from '@/helpers/request'

export default {
  name: 'ComputerWorkstationsView',
  data() {
    return {
      loading: false,
      workstations: [],
      productionSites: [],
      manufacturers: [],
      dialogVisible: false,
      isEdit: false,
      currentWorkstationId: null,
      workstationForm: {
        workstation_id: '',
        description: '',
        type: '',
        processor_specifications: '',
        ram: '',
        harddisk_capacity: '',
        operating_system: '',
        manufacturer_id: '',
        model: '',
        year: '',
        form_factor: '',
        supplier: '',
        production_site_id: ''
      },
      rules: {
        workstation_id: [{ required: true, message: 'Please enter workstation ID', trigger: 'blur' }],
        description: [{ required: true, message: 'Please enter description', trigger: 'blur' }],
        type: [{ required: true, message: 'Please select type', trigger: 'change' }],
        processor_specifications: [{ required: true, message: 'Please enter processor', trigger: 'blur' }],
        ram: [{ required: true, message: 'Please select RAM', trigger: 'change' }],
        harddisk_capacity: [{ required: true, message: 'Please select hard disk', trigger: 'change' }],
        operating_system: [{ required: true, message: 'Please select operating system', trigger: 'blur' }],
        manufacturer_id: [{ required: true, message: 'Please select manufacturer', trigger: 'change' }],
        model: [{ required: true, message: 'Please enter model', trigger: 'blur' }],
        year: [{ required: true, message: 'Please enter year', trigger: 'blur' }],
        form_factor: [{ required: true, message: 'Please select form factor', trigger: 'change' }],
        supplier: [{ required: true, message: 'Please select supplier', trigger: 'change' }],
        production_site_id: [{ required: true, message: 'Please select production site', trigger: 'change' }]
      },
      search: '',
      currentPage: 1,
      pageSize: 5,
      ramOptions: ['4 GB', '8 GB', '12 GB', '16 GB', '32 GB', '64 GB', '128 GB'],
      hardDiskOptions: ['128 GB', '256 GB', '512 GB', '1 TB', '2 TB', '4 TB', '8 TB', '> 8 TB']
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Workstation' : 'Add New Workstation'
    },
    filteredWorkstations() {
      if (!this.search) return this.workstations
      return this.workstations.filter(workstation =>
        workstation.workstation_id.toLowerCase().includes(this.search.toLowerCase()) ||
        workstation.description.toLowerCase().includes(this.search.toLowerCase()) ||
        workstation.production_site.site_name.toLowerCase().includes(this.search.toLowerCase())
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
        const workstationsStore = useComputerWorkstationsStore()
        if(workstationsStore.workstations.length === 0) {
          await workstationsStore.fetchWorkstations()
        }
        this.workstations = workstationsStore.workstations
      } catch (error) {
        ElMessage.error('Failed to fetch workstations: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    async fetchProductionSites() {
      const sitesStore = useProductionSitesStore()
      try {
        if(sitesStore.sites.length === 0) {
          await sitesStore.fetchSites()
        }
        this.productionSites = sitesStore.sites
      } catch (error) {
        ElMessage.error('Failed to fetch production sites: ' + error.message)
      }
    },
    async fetchManufacturers() {
      const manufacturersStore = useManufacturersStore()
      try {
        if(manufacturersStore.manufacturers.length === 0) {
          await manufacturersStore.fetchManufacturers()
        }
        this.manufacturers = manufacturersStore.manufacturers
      } catch (error) {
        ElMessage.error('Failed to fetch manufacturers: ' + error.message)
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.currentWorkstationId = null
      this.workstationForm = {
        workstation_id: '',
        description: '',
        type: '',
        processor_specifications: '',
        ram: '',
        harddisk_capacity: '',
        operating_system: '',
        manufacturer_id: '',
        model: '',
        year: '',
        form_factor: '',
        supplier: '',
        production_site_id: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(workstation) {
      this.isEdit = true
      this.currentWorkstationId = workstation.id
      this.workstationForm = {
        workstation_id: workstation.workstation_id,
        description: workstation.description,
        type: workstation.type,
        processor_specifications: workstation.processor_specifications,
        ram: workstation.ram,
        harddisk_capacity: workstation.harddisk_capacity,
        operating_system: workstation.operating_system,
        manufacturer_id: workstation.manufacturer_id,
        model: workstation.model,
        year: workstation.year,
        form_factor: workstation.form_factor,
        supplier: workstation.supplier,
        production_site_id: workstation.production_site_id
      }
      this.dialogVisible = true
    },
    async exportWorkstations() {
      try {
        let response = await appRequest.get('/report/workstations/export/csv')
        console.log("🚀 ~ exportProducts ~ response:", response)
        let blob = new Blob([response], { type: 'text/csv' })
        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = url
        a.download = 'workstations.csv'
        a.click()
        
        ElMessage.success('Exported workstations!')
      } catch (error) {
          console.log(error);
      };
      
    },
    async handleSubmit() {
      if (!this.$refs.workstationForm) return
      
      try {
        await this.$refs.workstationForm.validate()
        const workstationsStore = useComputerWorkstationsStore()
        
        if (this.isEdit) {
          await workstationsStore.updateWorkstation(this.currentWorkstationId, this.workstationForm)
          ElMessage.success('Workstation updated successfully')
        } else {
          await workstationsStore.createWorkstation(this.workstationForm)
          ElMessage.success('Workstation created successfully')
        }
        this.dialogVisible = false
        this.fetchWorkstations()
      } catch (error) {
        ElMessage.error('Failed to save workstation: ' + error.message)
      }
    },
    async confirmDelete(workstation) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this workstation?',
          'Warning',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        const workstationsStore = useComputerWorkstationsStore()
        await workstationsStore.deleteWorkstation(workstation.id)
        ElMessage.success('Workstation deleted successfully')
        this.fetchWorkstations()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to delete workstation: ' + error.message)
        }
      }
    }
  },
  mounted() {
    this.fetchWorkstations()
    this.fetchProductionSites()
    this.fetchManufacturers()
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
