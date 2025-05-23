<template>
  <div class="projects-container">
    <div class="header-actions">
      <div class="left-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><plus /></el-icon>
          Add New Project
        </el-button>
        <!-- <el-button @click="exportProjects">
          <el-icon><download /></el-icon>
          Export
        </el-button> -->
      </div>
      <div class="right-actions">
        <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
      </div>
    </div>

    <el-card class="projects-card">
      <el-table
        :data="pagedProjects"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="project_number" label="Project Number" min-width="130" />
        <el-table-column prop="project_description" label="Description" min-width="180" />
        <el-table-column prop="purchase_order_date" label="Purchase Order Date" min-width="130" />
        <el-table-column prop="commissioning_date" label="Commissioning Date" min-width="130" />
        <el-table-column prop="client.client_name" label="Client" min-width="130" />
        <el-table-column prop="production_site.site_name" label="Production Site" min-width="130" />
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
          :total="filteredProjects.length"
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
        ref="projectForm"
        :model="projectForm"
        :rules="rules"
        label-width="155px"
      >
        <el-form-item label="Project Number" prop="project_number">
          <el-input v-model="projectForm.project_number" />
        </el-form-item>
        <el-form-item label="Description" prop="project_description">
          <el-input v-model="projectForm.project_description" />
        </el-form-item>
        <el-form-item label="Purchase Order Date" prop="purchase_order_date">
          <el-date-picker
            v-model="projectForm.purchase_order_date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Commissioning Date" prop="commissioning_date">
          <el-date-picker
            v-model="projectForm.commissioning_date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Client" prop="client_id">
          <el-select v-model="projectForm.client_id" filterable placeholder="Select client">
            <el-option
              v-for="client in clients"
              :key="client.id"
              :label="client.client_name"
              :value="client.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Production Site" prop="production_site_id">
          <el-select v-model="projectForm.production_site_id" filterable placeholder="Select site">
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
import { useProjectsStore } from '@/stores/projects'
import { useClientsStore } from '@/stores/clients'
import { useProductionSitesStore } from '@/stores/productionSites'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ProjectsView',
  data() {
    return {
      loading: false,
      projects: [],
      clients: [],
      productionSites: [],
      dialogVisible: false,
      isEdit: false,
      currentProjectId: null,
      projectForm: {
        project_number: '',
        project_description: '',
        purchase_order_date: '',
        commissioning_date: '',
        client_id: '',
        production_site_id: ''
      },
      rules: {
        project_number: [
          { required: true, message: 'Please enter project number', trigger: 'blur' }
        ],
        project_description: [
          { required: true, message: 'Please enter description', trigger: 'blur' }
        ],
        purchase_order_date: [
          { required: true, message: 'Please select purchase order date', trigger: 'change' }
        ],
        commissioning_date: [
          { required: true, message: 'Please select commissioning date', trigger: 'change' }
        ],
        client_id: [
          { required: true, message: 'Please select client', trigger: 'change' }
        ],
        production_site_id: [
          { required: true, message: 'Please select production site', trigger: 'change' }
        ]
      },
      search: '',
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? 'Edit Project' : 'Add New Project'
    },
    filteredProjects() {
      if (!this.search) return this.projects
      return this.projects.filter(project =>
        project.project_number.toLowerCase().includes(this.search.toLowerCase()) ||
        project.project_description.toLowerCase().includes(this.search.toLowerCase()) ||
        project.client.client_name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    pagedProjects() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredProjects.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchProjects() {
      this.loading = true
      try {
        const projectsStore = useProjectsStore()
        if(projectsStore.projects.length == 0){
          await projectsStore.fetchProjects()
        }
        this.projects = projectsStore.projects
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchClients() {
      const clientsStore = useClientsStore()
      try {
        if(clientsStore.clients.length === 0) {
          await clientsStore.fetchClients()
        }
        this.clients = clientsStore.clients
      } catch (error) {
        console.error('Failed to fetch clients:', error)
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
      this.currentProjectId = null
      this.projectForm = {
        project_number: '',
        project_description: '',
        purchase_order_date: '',
        commissioning_date: '',
        client_id: '',
        production_site_id: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(project) {
      this.isEdit = true
      this.currentProjectId = project.id
      this.projectForm = {
        project_number: project.project_number,
        project_description: project.project_description,
        purchase_order_date: project.purchase_order_date,
        commissioning_date: project.commissioning_date,
        client_id: project.client_id,
        production_site_id: project.production_site_id
      }
      this.dialogVisible = true
    },
    exportProjects() {
      ElMessage.success('Exported projects!')
    },
    async handleSubmit() {
      if (!this.$refs.projectForm) return
      
      try {
        await this.$refs.projectForm.validate()
        const projectsStore = useProjectsStore()
        
        if (this.isEdit) {
          await projectsStore.updateProject(this.currentProjectId, this.projectForm)
          ElMessage.success('Project updated successfully')
        } else {
          await projectsStore.createProject(this.projectForm)
          ElMessage.success('Project created successfully')
        }
        this.dialogVisible = false
        this.fetchProjects()
      } catch (error) {
        console.error('Failed to save project:', error)
      }
    },
    async confirmDelete(project) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this project?',
          'Warning',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        const projectsStore = useProjectsStore()
        await projectsStore.deleteProject(project.id)
        ElMessage.success('Project deleted successfully')
        this.fetchProjects()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to delete project:', error)
        }
      }
    }
  },
  mounted() {
    this.fetchProjects()
    this.fetchClients()
    this.fetchProductionSites()
  }
}
</script>

<style scoped>
.projects-container {
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

.projects-card {
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