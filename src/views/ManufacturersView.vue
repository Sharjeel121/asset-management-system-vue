<template>
  <div class="manufacturers-container">
    <div class="header-actions">
      <div class="left-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><plus /></el-icon>
          Add New Manufacturer
        </el-button>
        <el-button @click="exportManufacturers">
          <el-icon><download /></el-icon>
          Export
        </el-button>
      </div>
      <div class="right-actions">
        <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
      </div>
    </div>

    <el-card class="manufacturers-card">
      <el-table
        :data="pagedManufacturers"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="manufacturer_name" label="Manufacturer Name" min-width="120" />
        <el-table-column prop="headquarters_address" label="Headquarters Address" min-width="180" />
        <el-table-column prop="product_range" label="Product Range" min-width="130" />
        <el-table-column prop="manufacturer_website" label="Manufacturer Website" min-width="180" />
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
          :total="filteredManufacturers.length"
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
        ref="manufacturerForm"
        :model="manufacturerForm"
        :rules="rules"
        label-width="170px"
      >
        <el-form-item label="Manufacturer Name" prop="manufacturer_name">
          <el-input v-model="manufacturerForm.manufacturer_name" />
        </el-form-item>
        <el-form-item label="Headquarters Address" prop="headquarters_address">
          <el-input v-model="manufacturerForm.headquarters_address" />
        </el-form-item>
        <el-form-item label="Product Range" prop="product_range">
          <el-input v-model="manufacturerForm.product_range" />
        </el-form-item>
        <el-form-item label="Manufacturer Website" prop="manufacturer_website">
          <el-input v-model="manufacturerForm.manufacturer_website" />
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
import { useManufacturersStore } from '@/stores/manufacturers'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ManufacturersView',
  data() {
    return {
      loading: false,
      manufacturers: [],
      dialogVisible: false,
      isEdit: false,
      currentManufacturerId: null,
      manufacturerForm: {
        manufacturer_name: '',
        headquarters_address: '',
        manufacturer_website: '',
        product_range: ''
      },
      rules: {
        manufacturer_name: [{ required: true, message: 'Please enter manufacturer name', trigger: 'blur' }],
        headquarters_address: [{ required: true, message: 'Please enter headquarters address', trigger: 'blur' }],
        product_range: [{ required: true, message: 'Please enter product range', trigger: 'blur' }],
        manufacturer_website: [{ required: true, message: 'Please enter manufacturer website', trigger: 'blur' }]
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
      return this.manufacturers.filter(manufacturer =>
        manufacturer.manufacturer_name.toLowerCase().includes(this.search.toLowerCase()) ||
        manufacturer.headquarters_address.toLowerCase().includes(this.search.toLowerCase()) ||
        manufacturer.product_range.toLowerCase().includes(this.search.toLowerCase())
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
        const manufacturersStore = useManufacturersStore()
        if(manufacturersStore.manufacturers.length === 0) {
          await manufacturersStore.fetchManufacturers()
        }
        this.manufacturers = manufacturersStore.manufacturers
      } catch (error) {
        ElMessage.error('Failed to fetch manufacturers: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.currentManufacturerId = null
      this.manufacturerForm = {
        manufacturer_name: '',
        headquarters_address: '',
        manufacturer_website: '',
        product_range: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(manufacturer) {
      this.isEdit = true
      this.currentManufacturerId = manufacturer.id
      this.manufacturerForm = {
        manufacturer_name: manufacturer.manufacturer_name,
        headquarters_address: manufacturer.headquarters_address,
        manufacturer_website: manufacturer.manufacturer_website,
        product_range: manufacturer.product_range
      }
      this.dialogVisible = true
    },
    exportManufacturers() {
      ElMessage.success('Exported manufacturers!')
    },
    async handleSubmit() {
      if (!this.$refs.manufacturerForm) return
      
      try {
        await this.$refs.manufacturerForm.validate()
        const manufacturersStore = useManufacturersStore()
        
        if (this.isEdit) {
          await manufacturersStore.updateManufacturer(this.currentManufacturerId, this.manufacturerForm)
          ElMessage.success('Manufacturer updated successfully')
        } else {
          await manufacturersStore.createManufacturer(this.manufacturerForm)
          ElMessage.success('Manufacturer created successfully')
        }
        this.dialogVisible = false
        this.fetchManufacturers()
      } catch (error) {
        ElMessage.error('Failed to save manufacturer: ' + error.message)
      }
    },
    async confirmDelete(manufacturer) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this manufacturer?',
          'Warning',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        const manufacturersStore = useManufacturersStore()
        await manufacturersStore.deleteManufacturer(manufacturer.id)
        ElMessage.success('Manufacturer deleted successfully')
        this.fetchManufacturers()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to delete manufacturer: ' + error.message)
        }
      }
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