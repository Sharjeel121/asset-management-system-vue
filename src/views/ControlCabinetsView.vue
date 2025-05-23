<template>
  <div class="cabinets-container">
    <div class="header-actions">
      <div class="left-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><plus /></el-icon>
          Add New Cabinet
        </el-button>
        <!-- <el-button @click="exportCabinets">
          <el-icon><download /></el-icon>
          Export
        </el-button> -->
      </div>
      <div class="right-actions">
        <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
      </div>
    </div>

    <el-card class="cabinets-card">
      <el-table
        :data="pagedCabinets"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="cabinet_id" label="Cabinet ID" min-width="100" />
        <el-table-column prop="description" label="Description" min-width="180" />
        <el-table-column prop="width" label="Width (mm)" min-width="100" />
        <el-table-column prop="height" label="Height (mm)" min-width="110" />
        <el-table-column prop="depth" label="Depth (mm)" min-width="100" />
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
          :total="filteredCabinets.length"
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
        ref="cabinetForm"
        :model="cabinetForm"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="Cabinet ID" prop="cabinet_id">
          <el-input v-model="cabinetForm.cabinet_id" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="cabinetForm.description" />
        </el-form-item>
        <el-form-item label="Width (mm)" prop="width">
          <el-input-number v-model="cabinetForm.width" :min="0" :precision="1" />
        </el-form-item>
        <el-form-item label="Height (mm)" prop="height">
          <el-input-number v-model="cabinetForm.height" :min="0" :precision="1" />
        </el-form-item>
        <el-form-item label="Depth (mm)" prop="depth">
          <el-input-number v-model="cabinetForm.depth" :min="0" :precision="1" />
        </el-form-item>
        <el-form-item label="Supplier" prop="supplier">
          <el-select v-model="cabinetForm.supplier" placeholder="Select supplier">
            <el-option label="CSI" value="CSI" />
            <el-option label="CLIENT" value="CLIENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="Production Site" prop="production_site_id">
          <el-select v-model="cabinetForm.production_site_id" filterable placeholder="Select site">
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
import { useControlCabinetsStore } from '@/stores/controlCabinets'
import { useProductionSitesStore } from '@/stores/productionSites'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ControlCabinetsView',
  data() {
    return {
      loading: false,
      cabinets: [],
      productionSites: [],
      dialogVisible: false,
      isEdit: false,
      currentCabinetId: null,
      cabinetForm: {
        cabinet_id: '',
        description: '',
        width: 0,
        height: 0,
        depth: 0,
        supplier: '',
        production_site_id: ''
      },
      rules: {
        cabinet_id: [{ required: true, message: 'Please enter cabinet ID', trigger: 'blur' }],
        description: [{ required: true, message: 'Please enter description', trigger: 'blur' }],
        width: [{ required: true, message: 'Please enter width', trigger: 'blur', type: 'number', min: 0 }],
        height: [{ required: true, message: 'Please enter height', trigger: 'blur', type: 'number', min: 0 }],
        depth: [{ required: true, message: 'Please enter depth', trigger: 'blur', type: 'number', min: 0 }],
        supplier: [{ required: true, message: 'Please select supplier', trigger: 'change' }],
        production_site_id: [{ required: true, message: 'Please select production site', trigger: 'change' }]
      },
      search: '',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Cabinet' : 'Add New Cabinet'
    },
    filteredCabinets() {
      if (!this.search) return this.cabinets
      return this.cabinets.filter(cabinet =>
        cabinet.cabinet_id.toLowerCase().includes(this.search.toLowerCase()) ||
        cabinet.description.toLowerCase().includes(this.search.toLowerCase()) ||
        cabinet.production_site.site_name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    pagedCabinets() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredCabinets.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchCabinets() {
      this.loading = true
      try {
        const cabinetsStore = useControlCabinetsStore()
        if(cabinetsStore.cabinets.length === 0) {
          await cabinetsStore.fetchCabinets()
        }
        this.cabinets = cabinetsStore.cabinets
      } catch (error) {
        console.error('Failed to fetch cabinets:', error)
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
        console.error('Failed to fetch production sites:', error)
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.currentCabinetId = null
      this.cabinetForm = {
        cabinet_id: '',
        description: '',
        width: 0,
        height: 0,
        depth: 0,
        supplier: '',
        production_site_id: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(cabinet) {
      this.isEdit = true
      this.currentCabinetId = cabinet.id
      this.cabinetForm = {
        cabinet_id: cabinet.cabinet_id,
        description: cabinet.description,
        width: cabinet.width,
        height: cabinet.height,
        depth: cabinet.depth,
        supplier: cabinet.supplier,
        production_site_id: cabinet.production_site_id
      }
      this.dialogVisible = true
    },
    exportCabinets() {
      ElMessage.success('Exported cabinets!')
    },
    async handleSubmit() {
      if (!this.$refs.cabinetForm) return
      
      try {
        await this.$refs.cabinetForm.validate()
        const cabinetsStore = useControlCabinetsStore()
        
        if (this.isEdit) {
          await cabinetsStore.updateCabinet(this.currentCabinetId, this.cabinetForm)
          ElMessage.success('Cabinet updated successfully')
        } else {
          await cabinetsStore.createCabinet(this.cabinetForm)
          ElMessage.success('Cabinet created successfully')
        }
        this.dialogVisible = false
        this.fetchCabinets()
      } catch (error) {
        console.error('Failed to save cabinet:', error)
      }
    },
    async confirmDelete(cabinet) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this cabinet?',
          'Warning',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        const cabinetsStore = useControlCabinetsStore()
        await cabinetsStore.deleteCabinet(cabinet.id)
        ElMessage.success('Cabinet deleted successfully')
        this.fetchCabinets()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to delete cabinet:', error)
        }
      }
    }
  },
  mounted() {
    this.fetchCabinets()
    this.fetchProductionSites()
  }
}
</script>

<style scoped>
.cabinets-container {
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

.cabinets-card {
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