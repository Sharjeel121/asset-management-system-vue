<template>
  <div class="software-container">
    <div class="header-actions">
      <div class="left-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><plus /></el-icon>
          Add New Software
        </el-button>
        <el-button @click="exportSoftware">
          <el-icon><download /></el-icon>
          Export
        </el-button>
      </div>
      <div class="right-actions">
        <span>Filters:</span>
        <el-select v-model="filterManufacturer" placeholder="Manufacturer" size="medium" class="filter-select">
          <el-option label="All" value="all" />
          <el-option v-for="m in manufacturers" :key="m.id" :label="m.manufacturer_name" :value="m.id" />
        </el-select>
        <el-select v-model="filterSupplier" placeholder="Supplier" size="medium" class="filter-select">
          <el-option label="All" value="all" />
          <el-option label="CSI" value="CSI" />
          <el-option label="CLIENT" value="CLIENT" />
        </el-select>
        <el-select v-model="filterFunction" placeholder="Function" size="medium" class="filter-select">
          <el-option label="All" value="all" />
          <el-option label="SCADA" value="SCADA" />
          <el-option label="HMI" value="HMI" />
          <el-option label="PLC Programming" value="PLC Programming" />
          <el-option label="MES" value="MES" />
          <el-option label="Database" value="Database" />
          <el-option label="Client Supervision" value="Client Supervision" />
          <el-option label="Other" value="Other" />
        </el-select>
        <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
      </div>
    </div>
    <el-card class="software-card">
      <el-table :data="pagedSoftware" style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="software_name" label="Name" min-width="150" />
        <el-table-column prop="manufacturer.manufacturer_name" label="Manufacturer" min-width="150" />
        <el-table-column prop="function" label="Function" min-width="120" />
        <el-table-column prop="license_version" label="License Version" min-width="120" />
        <el-table-column prop="license_type" label="License Type" min-width="120" />
        <el-table-column prop="supplier" label="Supplier" min-width="100" />
        <el-table-column prop="computer_workstation.workstation_id" label="Workstation" min-width="120" />
        <el-table-column prop="production_site.site_name" label="Site" min-width="150" />
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
          :total="filteredSoftware.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
        />
      </div>
    </el-card>
    <!-- Add/Edit Dialog -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form ref="softwareForm" :model="softwareForm" :rules="rules" label-width="170px">
        <el-form-item label="Software Name" prop="software_name">
          <el-input v-model="softwareForm.software_name" />
        </el-form-item>
        <el-form-item label="Manufacturer" prop="manufacturer_id">
          <el-select v-model="softwareForm.manufacturer_id" filterable placeholder="Select manufacturer">
            <el-option v-for="m in manufacturers" :key="m.id" :label="m.manufacturer_name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Function" prop="function">
          <el-select v-model="softwareForm.function" placeholder="Select function">
            <el-option label="SCADA" value="SCADA" />
            <el-option label="HMI" value="HMI" />
            <el-option label="PLC Programming" value="PLC Programming" />
            <el-option label="MES" value="MES" />
            <el-option label="Database" value="Database" />
            <el-option label="Client Supervision" value="Client Supervision" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
        <el-form-item label="License Version" prop="license_version">
          <el-input v-model="softwareForm.license_version" />
        </el-form-item>
        <el-form-item label="License Type" prop="license_type">
          <el-select v-model="softwareForm.license_type" placeholder="Select license type">
            <el-option label="Electronic" value="electronic" />
            <el-option label="USB Dongle" value="usb_dongle" />
            <el-option label="Paper" value="paper" />
            <el-option label="Other" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="Supplier" prop="supplier">
          <el-select v-model="softwareForm.supplier" placeholder="Select supplier">
            <el-option label="CSI" value="CSI" />
            <el-option label="CLIENT" value="CLIENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="Computer Workstation" prop="computer_workstation_id">
          <el-select v-model="softwareForm.computer_workstation_id" filterable placeholder="Select workstation">
            <el-option v-for="ws in computerWorkstations" :key="ws.id" :label="ws.workstation_id" :value="ws.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Production Site" prop="production_site_id">
          <el-select v-model="softwareForm.production_site_id" filterable placeholder="Select site">
            <el-option v-for="site in productionSites" :key="site.id" :label="site.site_name" :value="site.id" />
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
import { useSoftwareStore } from '@/stores/software'
import { useManufacturersStore } from '@/stores/manufacturers'
import { useProductionSitesStore } from '@/stores/productionSites'
import { useComputerWorkstationsStore } from '@/stores/computerWorkstations'
import { ElMessage, ElMessageBox } from 'element-plus'
import appRequest from '@/helpers/request'

export default {
  name: 'SoftwareView',
  data() {
    return {
      loading: false,
      softwareList: [], // Renamed to avoid conflict with store state name
      manufacturers: [],
      productionSites: [],
      computerWorkstations: [],
      dialogVisible: false,
      isEdit: false,
      currentSoftwareId: null,
      softwareForm: {
        software_name: '',
        manufacturer_id: '',
        function: '',
        license_version: '',
        license_type: '',
        supplier: '',
        computer_workstation_id: null, // Allow null
        production_site_id: ''
      },
      rules: {
        software_name: [{ required: true, message: 'Please enter software name', trigger: 'blur' }],
        manufacturer_id: [{ required: true, message: 'Please select manufacturer', trigger: 'change' }],
        function: [{ required: true, message: 'Please select function', trigger: 'change' }],
        license_version: [{ required: true, message: 'Please enter license version', trigger: 'blur' }],
        license_type: [{ required: true, message: 'Please select license type', trigger: 'change' }],
        supplier: [{ required: true, message: 'Please select supplier', trigger: 'change' }],
        production_site_id: [{ required: true, message: 'Please select production site', trigger: 'change' }]
        // computer_workstation_id can be optional
      },
      search: '',
      currentPage: 1,
      pageSize: 5,
      filterManufacturer: 'all',
      filterSupplier: 'all',
      filterFunction: 'all'
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Software' : 'Add New Software'
    },
    filteredSoftware() {
      let filtered = this.softwareList

      // Apply search filter
      if (this.search) {
        filtered = filtered.filter(item =>
          (item.software_name && item.software_name.toLowerCase().includes(this.search.toLowerCase())) ||
          (item.manufacturer && item.manufacturer.manufacturer_name && item.manufacturer.manufacturer_name.toLowerCase().includes(this.search.toLowerCase())) ||
          (item.production_site && item.production_site.site_name && item.production_site.site_name.toLowerCase().includes(this.search.toLowerCase()))
        )
      }

      // Apply manufacturer filter
      if (this.filterManufacturer !== 'all') {
        filtered = filtered.filter(item => item.manufacturer_id === this.filterManufacturer)
      }

      // Apply supplier filter
      if (this.filterSupplier !== 'all') {
        filtered = filtered.filter(item => item.supplier === this.filterSupplier)
      }

      // Apply function filter
      if (this.filterFunction !== 'all') {
        filtered = filtered.filter(item => item.function === this.filterFunction)
      }

      return filtered
    },
    pagedSoftware() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredSoftware.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchSoftwareList() { // Renamed method
      this.loading = true
      const softwareStore = useSoftwareStore()
      try {
        if (softwareStore.software.length === 0) {
          await softwareStore.fetchSoftware()
        }
        this.softwareList = softwareStore.software
      } catch (error) {
        ElMessage.error('Failed to fetch software: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    async fetchManufacturers() {
      const manufacturersStore = useManufacturersStore()
      try {
        if (manufacturersStore.manufacturers.length === 0) {
          await manufacturersStore.fetchManufacturers()
        }
        this.manufacturers = manufacturersStore.manufacturers
      } catch (error) {
        ElMessage.error('Failed to fetch manufacturers: ' + error.message)
      }
    },
    async fetchProductionSites() {
      const sitesStore = useProductionSitesStore()
      try {
        if (sitesStore.sites.length === 0) {
         await sitesStore.fetchSites()
        }
        this.productionSites = sitesStore.sites
      } catch (error) {
        ElMessage.error('Failed to fetch production sites: ' + error.message)
      }
    },
    async fetchComputerWorkstations() {
      const workstationsStore = useComputerWorkstationsStore()
      try {
        if (workstationsStore.workstations.length === 0) {
          await workstationsStore.fetchWorkstations()
        }
        this.computerWorkstations = workstationsStore.workstations
      } catch (error) {
        ElMessage.error('Failed to fetch computer workstations: ' + error.message)
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.currentSoftwareId = null
      this.softwareForm = {
        software_name: '',
        manufacturer_id: '',
        function: '',
        license_version: '',
        license_type: '',
        supplier: '',
        computer_workstation_id: null,
        production_site_id: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(item) {
      this.isEdit = true
      this.currentSoftwareId = item.id
      this.softwareForm = {
        software_name: item.software_name,
        manufacturer_id: item.manufacturer_id,
        function: item.function,
        license_version: item.license_version,
        license_type: item.license_type,
        supplier: item.supplier,
        computer_workstation_id: item.computer_workstation_id,
        production_site_id: item.production_site_id
      }
      this.dialogVisible = true
    },
    async exportSoftware() {
      try {
        let response = await appRequest.get('/report/softwares/export/csv')
        console.log("🚀 ~ exportProducts ~ response:", response)
        let blob = new Blob([response], { type: 'text/csv' })
        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = url
        a.download = 'softwares.csv'
        a.click()
        
        ElMessage.success('Exported software!') // Placeholder
      } catch (error) {
          console.log(error);
      };
    },
    async handleSubmit() {
      if (!this.$refs.softwareForm) return
      try {
        await this.$refs.softwareForm.validate()
        const softwareStore = useSoftwareStore()
        if (this.isEdit) {
          await softwareStore.updateSoftware(this.currentSoftwareId, this.softwareForm)
          ElMessage.success('Software updated successfully')
        } else {
          await softwareStore.createSoftware(this.softwareForm)
          ElMessage.success('Software created successfully')
        }
        this.dialogVisible = false
        this.fetchSoftwareList() // Refresh list
      } catch (error) {
        ElMessage.error('Failed to save software: ' + error.message)
      }
    },
    async confirmDelete(item) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this software?',
          'Warning',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        const softwareStore = useSoftwareStore()
        await softwareStore.deleteSoftware(item.id)
        ElMessage.success('Software deleted successfully')
        this.fetchSoftwareList() // Refresh list
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to delete software: ' + error.message)
        }
      }
    }
  },
  mounted() {
    this.fetchSoftwareList()
    this.fetchManufacturers()
    this.fetchProductionSites()
    this.fetchComputerWorkstations()
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
  flex-wrap: wrap;
  gap: 10px;
}
.left-actions, .right-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.search-input {
  width: 200px;
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
.right-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  span {
    color: black;
  }
}
.filter-select {
  width: 140px;
}
</style> 