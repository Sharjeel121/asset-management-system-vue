<template>
  <div class="cabinets-container">
    <div class="header-actions">
      <h2>Control Cabinets Management</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><plus /></el-icon>
        Add New Cabinet
      </el-button>
      <el-input v-model="search" placeholder="Search..." size="small" class="search-input" clearable />
    </div>

    <el-card class="cabinets-card">
      <el-table
        :data="pagedCabinets"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="cabinetId" label="Cabinet ID" />
        <el-table-column prop="description" label="Description" />
        <el-table-column prop="width" label="Width (mm)" />
        <el-table-column prop="height" label="Height (mm)" />
        <el-table-column prop="depth" label="Depth (mm)" />
        <el-table-column prop="supplier" label="Supplier" />
        <el-table-column prop="site" label="Production Site" />
        <el-table-column label="Actions" width="180">
          <template #default="scope">
            <el-button-group>
              <el-button
                size="small"
                @click="showEditDialog(scope.row)"
              >
                Edit
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="confirmDelete(scope.row)"
              >
                Delete
              </el-button>
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
        ref="cabinetForm"
        :model="cabinetForm"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="Cabinet ID" prop="cabinetId">
          <el-input v-model="cabinetForm.cabinetId" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="cabinetForm.description" />
        </el-form-item>
        <el-form-item label="Width (mm)" prop="width">
          <el-input-number v-model="cabinetForm.width" :min="0" />
        </el-form-item>
        <el-form-item label="Height (mm)" prop="height">
          <el-input-number v-model="cabinetForm.height" :min="0" />
        </el-form-item>
        <el-form-item label="Depth (mm)" prop="depth">
          <el-input-number v-model="cabinetForm.depth" :min="0" />
        </el-form-item>
        <el-form-item label="Supplier" prop="supplier">
          <el-select v-model="cabinetForm.supplier" placeholder="Select supplier">
            <el-option label="CSI" value="CSI" />
            <el-option label="CLIENT" value="CLIENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="Production Site" prop="site">
          <el-select v-model="cabinetForm.site" filterable placeholder="Select site">
            <el-option v-for="site in sites" :key="site" :label="site" :value="site" />
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
import { useControlCabinetsStore } from '../stores/controlCabinets'

export default {
  name: 'ControlCabinetsView',
  data() {
    return {
      loading: false,
      cabinets: [
        {
          id: 1,
          cabinetId: 'CAB-001',
          description: 'Main Control Cabinet',
          width: 800,
          height: 2000,
          depth: 600,
          supplier: 'CSI',
          site: 'Paris Factory'
        },
        {
          id: 2,
          cabinetId: 'CAB-002',
          description: 'Remote I/O Cabinet',
          width: 600,
          height: 1800,
          depth: 500,
          supplier: 'CLIENT',
          site: 'Berlin Factory'
        }
      ],
      sites: ['Paris Factory', 'Berlin Factory', 'Lyon Distribution Center'],
      dialogVisible: false,
      isEdit: false,
      cabinetForm: {
        cabinetId: '',
        description: '',
        width: 0,
        height: 0,
        depth: 0,
        supplier: '',
        site: ''
      },
      rules: {
        cabinetId: [{ required: true, message: 'Please enter cabinet ID', trigger: 'blur' }],
        description: [{ required: true, message: 'Please enter description', trigger: 'blur' }],
        width: [{ required: true, message: 'Please enter width', trigger: 'blur', type: 'number', min: 0 }],
        height: [{ required: true, message: 'Please enter height', trigger: 'blur', type: 'number', min: 0 }],
        depth: [{ required: true, message: 'Please enter depth', trigger: 'blur', type: 'number', min: 0 }],
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
      return this.isEdit ? 'Edit Cabinet' : 'Add New Cabinet'
    },
    filteredCabinets() {
      if (!this.search) return this.cabinets
      return this.cabinets.filter(item =>
        item.cabinetId.toLowerCase().includes(this.search.toLowerCase()) ||
        item.site.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    pagedCabinets() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredCabinets.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchCabinets() {
      const cabinetsStore = useControlCabinetsStore()
      this.loading = true
      try {
        await cabinetsStore.fetchCabinets()
        this.cabinets = cabinetsStore.cabinets
      } finally {
        this.loading = false
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.cabinetForm = {
        cabinetId: '',
        description: '',
        width: 0,
        height: 0,
        depth: 0,
        supplier: '',
        site: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(item) {
      this.isEdit = true
      this.cabinetForm = { ...item }
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        await this.$refs.cabinetForm.validate()
        const cabinetsStore = useControlCabinetsStore()
        if (this.isEdit) {
          await cabinetsStore.updateCabinet(this.cabinetForm.id, this.cabinetForm)
        } else {
          await cabinetsStore.createCabinet(this.cabinetForm)
        }
        this.dialogVisible = false
        this.fetchCabinets()
      } catch (error) {
        console.error('Form validation failed:', error)
      }
    },
    confirmDelete(item) {
      this.$confirm(
        'This will permanently delete the cabinet. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        const cabinetsStore = useControlCabinetsStore()
        cabinetsStore.deleteCabinet(item.id)
        this.fetchCabinets()
        this.$message({
          type: 'success',
          message: 'Cabinet deleted successfully'
        })
      }).catch(() => {})
    }
  },
  mounted() {
    // this.fetchCabinets()
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