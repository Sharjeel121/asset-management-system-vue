<template>
  <div class="products-container">
    <div class="header-actions">
      <div class="left-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><plus /></el-icon>
          Add New Product
        </el-button>
        <el-button @click="exportProducts">
          <el-icon><download /></el-icon>
          Export
        </el-button>
      </div>
      <div class="right-actions">
        <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
      </div>
    </div>
    <el-card class="products-card">
      <el-table :data="pagedProducts" style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="description" label="Description" min-width="130" />
        <el-table-column prop="manufacturer.manufacturer_name" label="Manufacturer" min-width="120" />
        <el-table-column prop="reference_number" label="Part Number" min-width="130" />
        <el-table-column prop="quantity" label="Quantity" min-width="100" />
        <el-table-column prop="function" label="Function" />
        <el-table-column prop="lifecycle_stage" label="Lifecycle Stage" />
        <el-table-column prop="supplier" label="Supplier" />
        <el-table-column prop="control_cabinet.cabinet_id" label="Control Cabinet" />
        <el-table-column prop="production_site.site_name" label="Production Site" />
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
          :total="filteredProducts.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
        />
      </div>
    </el-card>
    <!-- Add/Edit Dialog -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form ref="productForm" :model="productForm" :rules="rules" label-width="170px">
        <el-form-item label="Description" prop="description">
          <!-- <el-input v-model="productForm.description" /> -->
          <el-autocomplete
          v-model="productForm.description"
          :fetch-suggestions="querySearchAsync"
          placeholder="Type to search existing products"
          @select="handleDescriptionSelect"
          clearable
          class="full-width"
        />
        </el-form-item>
        <el-form-item label="Manufacturer" prop="manufacturer_id">
          <el-select v-model="productForm.manufacturer_id" filterable placeholder="Select manufacturer">
            <el-option v-for="m in manufacturers" :key="m.id" :label="m.manufacturer_name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Part Number" prop="reference_number">
          <el-input v-model="productForm.reference_number" />
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
        <el-form-item label="Lifecycle Stage" prop="lifecycle_stage">
          <el-select v-model="productForm.lifecycle_stage" placeholder="Select lifecycle">
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
        <el-form-item label="Control Cabinet" prop="control_cabinet_id">
          <el-select v-model="productForm.control_cabinet_id" filterable placeholder="Select cabinet">
            <el-option v-for="c in controlCabinets" :key="c.id" :label="c.cabinet_id" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Production Site" prop="production_site_id">
          <el-select v-model="productForm.production_site_id" filterable placeholder="Select site">
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
import { useAutomationProductsStore } from '@/stores/automationProducts'
import { useManufacturersStore } from '@/stores/manufacturers'
import { useProductionSitesStore } from '@/stores/productionSites'
import { useControlCabinetsStore } from '@/stores/controlCabinets'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AutomationProductsView',
  data() {
    return {
      loading: false,
      products: [],
      manufacturers: [],
      productionSites: [],
      controlCabinets: [],
      dialogVisible: false,
      isEdit: false,
      currentProductId: null,
      productForm: {
        description: '',
        manufacturer_id: '',
        reference_number: '',
        quantity: 0,
        function: '',
        lifecycle_stage: '',
        supplier: '',
        control_cabinet_id: '',
        production_site_id: ''
      },
      rules: {
        description: [{ required: true, message: 'Please enter description', trigger: 'blur' }],
        manufacturer_id: [{ required: true, message: 'Please select manufacturer', trigger: 'change' }],
        reference_number: [{ required: true, message: 'Please enter part number', trigger: 'blur' }],
        quantity: [{ required: true, message: 'Please enter quantity', trigger: 'blur', type: 'number', min: 0 }],
        function: [{ required: true, message: 'Please select function', trigger: 'change' }],
        lifecycle_stage: [{ required: true, message: 'Please select lifecycle stage', trigger: 'change' }],
        supplier: [{ required: true, message: 'Please select supplier', trigger: 'change' }],
        control_cabinet_id: [{ required: true, message: 'Please select control cabinet', trigger: 'change' }],
        production_site_id: [{ required: true, message: 'Please select production site', trigger: 'change' }]
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
      return this.products.filter(product =>
        product.description.toLowerCase().includes(this.search.toLowerCase()) ||
        (product.manufacturer && product.manufacturer.manufacturer_name && product.manufacturer.manufacturer_name.toLowerCase().includes(this.search.toLowerCase()))
      )
    },
    pagedProducts() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredProducts.slice(start, start + this.pageSize)
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
    const results = queryString
      ? this.products.filter(product => 
          product.description.toLowerCase().includes(queryString.toLowerCase())
        )
      : this.products;
    
    const suggestions = results.map(product => ({
      value: product.description,
      item: product
    }));
    
    cb(suggestions);
  },

  handleDescriptionSelect(data) {
    const product = data.item;
    // Fill all fields except reference_number and quantity
    this.productForm = {
      ...this.productForm,
      description: product.description,
      manufacturer_id: product.manufacturer_id,
      function: product.function,
      lifecycle_stage: product.lifecycle_stage,
      supplier: product.supplier,
      control_cabinet_id: product.control_cabinet_id,
      production_site_id: product.production_site_id,
      // Keep these empty/default
      reference_number: '',
      quantity: 0
    };
  },
    async fetchProducts() {
      this.loading = true
      try {
        const productsStore = useAutomationProductsStore()
        if(productsStore.products.length === 0) {
          await productsStore.fetchProducts()
        }
        this.products = productsStore.products
      } catch (error) {
        ElMessage.error('Failed to fetch products: ' + error.message)
      } finally {
        this.loading = false
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
    async fetchControlCabinets() {
      const cabinetsStore = useControlCabinetsStore()
      try {
        if(cabinetsStore.cabinets.length === 0) {
          await cabinetsStore.fetchCabinets()
        }
        this.controlCabinets = cabinetsStore.cabinets
      } catch (error) {
        ElMessage.error('Failed to fetch control cabinets: ' + error.message)
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.currentProductId = null
      this.productForm = {
        description: '',
        manufacturer_id: '',
        reference_number: '',
        quantity: 0,
        function: '',
        lifecycle_stage: '',
        supplier: '',
        control_cabinet_id: '',
        production_site_id: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(product) {
      this.isEdit = true
      this.currentProductId = product.id
      this.productForm = {
        description: product.description,
        manufacturer_id: product.manufacturer_id,
        reference_number: product.reference_number,
        quantity: product.quantity,
        function: product.function,
        lifecycle_stage: product.lifecycle_stage,
        supplier: product.supplier,
        control_cabinet_id: product.control_cabinet_id,
        production_site_id: product.production_site_id
      }
      this.dialogVisible = true
    },
    exportProducts() {
      ElMessage.success('Exported products!')
    },
    async handleSubmit() {
      if (!this.$refs.productForm) return
      try {
        await this.$refs.productForm.validate()
        const productsStore = useAutomationProductsStore()
        if (this.isEdit) {
          await productsStore.updateProduct(this.currentProductId, this.productForm)
          ElMessage.success('Product updated successfully')
        } else {
          await productsStore.createProduct(this.productForm)
          ElMessage.success('Product created successfully')
        }
        this.dialogVisible = false
        this.fetchProducts()
      } catch (error) {
        ElMessage.error('Failed to save product: ' + error.message)
      }
    },
    async confirmDelete(product) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this product?',
          'Warning',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        const productsStore = useAutomationProductsStore()
        await productsStore.deleteProduct(product.id)
        ElMessage.success('Product deleted successfully')
        this.fetchProducts()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to delete product: ' + error.message)
        }
      }
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchManufacturers()
    this.fetchProductionSites()
    this.fetchControlCabinets()
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