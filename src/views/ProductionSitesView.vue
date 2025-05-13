<template>
  <div class="sites-container">
    <div class="header-actions">
      <div class="left-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><plus /></el-icon>
          New Production Site
        </el-button>
        <el-button @click="exportSites">
          <el-icon><download /></el-icon>
          Export
        </el-button>
      </div>
      <div class="right-actions">
        <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
      </div>
    </div>

    <el-card class="sites-card">
      <el-table
        :data="pagedSites"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="client.client_name" label="Client" />
        <el-table-column prop="site_name" label="Site Name" min-width="130" />
        <el-table-column prop="site_address" label="Site Address" min-width="150" />
        <el-table-column prop="city" label="City" />
        <el-table-column prop="country" label="Country" />
        <el-table-column prop="contact_person_name" label="Contact Name" min-width="130" />
        <el-table-column prop="contact_person_email" label="Contact Email" min-width="130" />
        <el-table-column prop="contact_person_phone_number" label="Contact Phone" min-width="130" />
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
          :total="filteredSites.length"
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
        ref="siteForm"
        :model="siteForm"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="Client" prop="client_id">
          <el-select v-model="siteForm.client_id" placeholder="Select Client">
            <el-option v-for="client in clients" :key="client.id" :label="client.client_name" :value="client.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Site Name" prop="site_name">
          <el-input v-model="siteForm.site_name" />
        </el-form-item>
        <el-form-item label="Site Address" prop="site_address">
          <el-input v-model="siteForm.site_address" />
        </el-form-item>
        <el-form-item label="Country" prop="country">
          <country-select class="custom-select" v-model="siteForm.country" :country="siteForm.country" topCountry="US" />        
        </el-form-item>
        <el-form-item label="City" prop="city">
          <region-select class="custom-select" v-model="siteForm.city" :country="siteForm.country" :region="siteForm.city" />
        </el-form-item>
        <el-form-item label="Contact Name" prop="contact_person_name">
          <el-input v-model="siteForm.contact_person_name" />
        </el-form-item>
        <el-form-item label="Contact Email" prop="contact_person_email">
          <el-input v-model="siteForm.contact_person_email" />
        </el-form-item>
        <el-form-item label="Contact Phone" prop="contact_person_phone_number">
          <el-input v-model="siteForm.contact_person_phone_number" />
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
import { useProductionSitesStore } from '@/stores/productionSites'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useClientsStore } from '@/stores/clients'

export default {
  name: 'ProductionSitesView',
  data() {
    return {
      loading: false,
      clients: [],
      sites: [],
      dialogVisible: false,
      isEdit: false,
      currentSiteId: null,
      siteForm: {
        client_id:'',
        site_name: '',
        site_address: '',
        city: '',
        country: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_phone_number: ''
      },
      rules: {
        client_id: [
          { required: true, message: 'Please select client', trigger: 'blur' }
        ],
        site_name: [
          { required: true, message: 'Please enter site name', trigger: 'blur' }
        ],
        site_address: [
          { required: true, message: 'Please enter site address', trigger: 'blur' }
        ],
        city: [
          { required: true, message: 'Please enter city', trigger: 'blur' }
        ],
        country: [
          { required: true, message: 'Please enter country', trigger: 'blur' }
        ]
      },
      search: '',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Production Site' : 'Add New Production Site'
    },
    filteredSites() {
      if (!this.search) return this.sites
      return this.sites.filter(site =>
        site.site_name.toLowerCase().includes(this.search.toLowerCase()) ||
        site.country.toLowerCase().includes(this.search.toLowerCase()) ||
        (site.contact_person_name && site.contact_person_name.toLowerCase().includes(this.search.toLowerCase()))
      )
    },
    pagedSites() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredSites.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchSites() {
      this.loading = true
      try {
        const sitesStore = useProductionSitesStore()
        if(sitesStore.sites.length === 0) {
          await sitesStore.fetchSites()
        }
        this.sites = sitesStore.sites
      } catch (error) {
        console.error('Failed to fetch sites: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.currentSiteId = null
      this.siteForm = {
        client_id:'',
        site_name: '',
        site_address: '',
        city: '',
        country: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_phone_number: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(site) {
      this.isEdit = true
      this.currentSiteId = site.id
      this.siteForm = { ...site }
      this.dialogVisible = true
    },
    exportSites() {
      ElMessage.success('Exported production sites!')
    },
    async handleSubmit() {
      if (!this.$refs.siteForm) return
      
      try {
        await this.$refs.siteForm.validate()
        const sitesStore = useProductionSitesStore()
        
        if (this.isEdit) {
          await sitesStore.updateSite(this.currentSiteId, this.siteForm)
          ElMessage.success('Production site updated successfully')
        } else {
          await sitesStore.createSite(this.siteForm)
          ElMessage.success('Production site created successfully')
        }
        this.dialogVisible = false
        // this.fetchSites()
      } catch (error) {
        console.error('Failed to save production site: ' + error.message)
      }
    },
    async confirmDelete(site) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this production site?',
          'Warning',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        const sitesStore = useProductionSitesStore()
        await sitesStore.deleteSite(site.id)
        ElMessage.success('Production site deleted successfully')
        this.fetchSites()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to delete production site: ' + error.message)
        }
      }
    },
    async fetchClients() {
      const clientsStore = useClientsStore()
      if(clientsStore.clients.length === 0) {
        await clientsStore.fetchClients()
      }
      this.clients = clientsStore.clients
    }
  },
  mounted() {
    this.fetchClients()
    this.fetchSites()
  }
}
</script>

<style scoped>
.custom-select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border-color: #dcdfe6;
}
.sites-container {
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
.sites-card {
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