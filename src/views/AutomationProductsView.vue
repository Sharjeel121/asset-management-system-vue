<template>
  <div class="products-container">
    <div class="header-actions">
      <el-button type="primary" @click="showAddDialog">
        <el-icon><plus /></el-icon>
        New Product
      </el-button>
      <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
    </div>
    <el-card class="products-card">
      <el-table :data="pagedProducts" style="width: 100%" v-loading="loading">
        <el-table-column prop="description" label="Description" min-width="130" />
        <el-table-column prop="manufacturer" label="Manufacturer" min-width="120" />
        <el-table-column prop="reference" label="Reference Number" min-width="130" />
        <el-table-column prop="quantity" label="Quantity" min-width="100" />
        <el-table-column prop="function" label="Function" />
        <el-table-column prop="lifecycle" label="Lifecycle Stage" />
        <el-table-column prop="supplier" label="Supplier" />
        <el-table-column prop="cabinet" label="Control Cabinet" />
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
          :total="filteredProducts.length"
          :page-size="pageSize"
          :current-page.sync="currentPage"
        />
      </div>
    </el-card>
    <!-- Add/Edit Dialog -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form ref="productForm" :model="productForm" :rules="rules" label-width="140px">
        <el-form-item label="Description" prop="description">
          <el-input v-model="productForm.description" />
        </el-form-item>
        <el-form-item label="Manufacturer" prop="manufacturer">
          <el-select v-model="productForm.manufacturer" filterable placeholder="Select manufacturer">
            <el-option v-for="m in manufacturers" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="Reference Number" prop="reference">
          <el-input v-model="productForm.reference" />
        </el-form-item>
        <el-form-item label="Quantity" prop="quantity">
          <el-input-number v-model="productForm.quantity" :min="0" />
        </el-form-item>
        <el-form-item label="Function" prop="function">
          <el-select v-model="productForm.function" placeholder="Select function">
            <el-option label="CPU controller" value="CPU controller" />
            <el-option label="I/O module" value="I/O module" />
            <el-option label="Power supply" value="Power supply" />
            <el-option label="Accessory" value="Accessory" />
            <el-option label="FTA" value="FTA" />
            <el-option label="Connector" value="Connector" />
            <el-option label="Switch" value="Switch" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-form-item>
        <el-form-item label="Lifecycle Stage" prop="lifecycle">
          <el-select v-model="productForm.lifecycle" placeholder="Select lifecycle">
            <el-option label="Obsolete" value="Obsolete" />
            <el-option label="Active" value="Active" />
            <el-option label="Mature" value="Mature" />
          </el-select>
        </el-form-item>
        <el-form-item label="Supplier" prop="supplier">
          <el-select v-model="productForm.supplier" placeholder="Select supplier">
            <el-option label="CSI" value="CSI" />
            <el-option label="CLIENT" value="CLIENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="Control Cabinet" prop="cabinet">
          <el-select v-model="productForm.cabinet" filterable placeholder="Select cabinet">
            <el-option v-for="c in cabinets" :key="c" :label="c" :value="c" />
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
  name: 'ProductsView',
  data() {
    return {
      loading: false,
      products: [],
      manufacturers: ['Siemens', 'Schneider', 'Allen-Bradley'],
      cabinets: ['CAB-001', 'CAB-002'],
      dialogVisible: false,
      isEdit: false,
      productForm: {
        description: '',
        manufacturer: '',
        reference: '',
        quantity: 0,
        function: '',
        lifecycle: '',
        supplier: '',
        cabinet: ''
      },
      rules: {
        description: [{ required: true, message: 'Please enter description', trigger: 'blur' }],
        manufacturer: [{ required: true, message: 'Please select manufacturer', trigger: 'change' }],
        reference: [{ required: true, message: 'Please enter reference number', trigger: 'blur' }],
        quantity: [{ required: true, message: 'Please enter quantity', trigger: 'blur', type: 'number', min: 0 }],
        function: [{ required: true, message: 'Please select function', trigger: 'change' }],
        lifecycle: [{ required: true, message: 'Please select lifecycle stage', trigger: 'change' }],
        supplier: [{ required: true, message: 'Please select supplier', trigger: 'change' }],
        cabinet: [{ required: true, message: 'Please select control cabinet', trigger: 'change' }]
      },
      search: '',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Product' : 'Add New Product'
    },
    filteredProducts() {
      if (!this.search) return this.products
      return this.products.filter(item =>
        item.description.toLowerCase().includes(this.search.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    pagedProducts() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredProducts.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true
      try {
        // TODO: Replace with API call
        this.products = [
          { description: 'CPU 315-2 PN/DP', manufacturer: 'Siemens', reference: '6ES7315-2EH14', quantity: 24, function: 'CPU controller', lifecycle: 'Active', supplier: 'CSI', cabinet: 'CAB-001' },
          { description: 'DI32xDC24V', manufacturer: 'Siemens', reference: '6ES7321-1BL00', quantity: 47, function: 'I/O module', lifecycle: 'Active', supplier: 'CLIENT', cabinet: 'CAB-002' }
        ]
      } finally {
        this.loading = false
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.productForm = {
        description: '',
        manufacturer: '',
        reference: '',
        quantity: 0,
        function: '',
        lifecycle: '',
        supplier: '',
        cabinet: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(item) {
      this.isEdit = true
      this.productForm = { ...item }
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        await this.$refs.productForm.validate()
        // TODO: Implement API call
        if (this.isEdit) {
          // Update product
        } else {
          // Create new product
        }
        this.dialogVisible = false
        this.fetchProducts()
      } catch (error) {
        console.error('Form validation failed:', error)
      }
    },
    confirmDelete(item) {
      this.$confirm(
        'This will permanently delete the product. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(() => {
        // TODO: Implement delete
        this.$message.success('Product deleted')
        this.fetchProducts()
      })
    }
  },
  mounted() {
    this.fetchProducts()
  }
}
</script>

<style scoped>
.products-container {
  padding: 20px;
}
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
}

.products-card {
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