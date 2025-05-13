<template>
  <div class="projects-container">
    <div class="header-actions">
      <h2>Projects Management</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><plus /></el-icon>
        Add New Project
      </el-button>
      <el-input v-model="search" placeholder="Search..." size="medium" class="search-input" clearable />
    </div>

    <el-card class="projects-card">
      <el-table
        :data="pagedProjects"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="number" label="Project Number" min-width="130" />
        <el-table-column prop="description" label="Description" min-width="180" />
        <el-table-column prop="purchaseOrderDate" label="Purchase Order Date" min-width="130" />
        <el-table-column prop="commissioningDate" label="Commissioning Date" min-width="130" />
        <el-table-column prop="client" label="Client" min-width="130" />
        <el-table-column prop="site" label="Production Site" min-width="130" />
        <el-table-column label="Actions" min-width="130">
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
          :total="filteredProjects.length"
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
        ref="projectForm"
        :model="projectForm"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="Project Number" prop="number">
          <el-input v-model="projectForm.number" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="projectForm.description" />
        </el-form-item>
        <el-form-item label="Purchase Order Date" prop="purchaseOrderDate">
          <el-date-picker
            v-model="projectForm.purchaseOrderDate"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Commissioning Date" prop="commissioningDate">
          <el-date-picker
            v-model="projectForm.commissioningDate"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Client" prop="client">
          <el-select v-model="projectForm.client" filterable placeholder="Select client">
            <el-option
              v-for="client in clients"
              :key="client"
              :label="client"
              :value="client"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Production Site" prop="site">
          <el-select v-model="projectForm.site" filterable placeholder="Select site">
            <el-option
              v-for="site in sites"
              :key="site"
              :label="site"
              :value="site"
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
import { useProjectsStore } from '../stores/projects'
import { useClientsStore } from '../stores/clients'

export default {
  name: 'ProjectsView',
  data() {
    return {
      loading: false,
      projects: [],
      clients: ['Acme Industries', 'TechCorp Global', 'Electro Systems'],
      sites: ['Paris Factory', 'Berlin Factory', 'Lyon Distribution Center'],
      dialogVisible: false,
      isEdit: false,
      projectForm: {
        number: '',
        description: '',
        purchaseOrderDate: '',
        commissioningDate: '',
        client: '',
        site: ''
      },
      rules: {
        number: [{ required: true, message: 'Please enter project number', trigger: 'blur' }],
        description: [{ required: true, message: 'Please enter description', trigger: 'blur' }],
        purchaseOrderDate: [{ required: true, message: 'Please select purchase order date', trigger: 'change' }],
        commissioningDate: [{ required: true, message: 'Please select commissioning date', trigger: 'change' }],
        client: [{ required: true, message: 'Please select client', trigger: 'change' }],
        site: [{ required: true, message: 'Please select production site', trigger: 'change' }]
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
      return this.projects.filter(item =>
        item.number.toLowerCase().includes(this.search.toLowerCase()) ||
        item.client.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    pagedProjects() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredProjects.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchProjects() {
      const projectsStore = useProjectsStore()
      this.loading = true
      try {
        await projectsStore.fetchProjects()
        this.projects = projectsStore.projects
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
        this.clients = clientsStore.clients.map(c => c.name)
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.projectForm = {
        number: '',
        description: '',
        purchaseOrderDate: '',
        commissioningDate: '',
        client: '',
        site: ''
      }
      this.dialogVisible = true
    },
    showEditDialog(item) {
      this.isEdit = true
      this.projectForm = { ...item }
      this.dialogVisible = true
    },
    async handleSubmit() {
      try {
        await this.$refs.projectForm.validate()
        const projectsStore = useProjectsStore()
        if (this.isEdit) {
          await projectsStore.updateProject(this.projectForm.id, this.projectForm)
        } else {
          await projectsStore.createProject(this.projectForm)
        }
        this.dialogVisible = false
        this.fetchProjects()
      } catch (error) {
        console.error('Form validation failed:', error)
      }
    },
    confirmDelete(item) {
      this.$confirm(
        'This will permanently delete the project. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(async () => {
        const projectsStore = useProjectsStore()
        await projectsStore.deleteProject(item.id)
        this.fetchProjects()
        this.$message({
          type: 'success',
          message: 'Project deleted successfully'
        })
      }).catch(() => {})
    }
  },
  created() {
    this.fetchProjects()
    this.fetchClients()
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
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.projects-card {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.search-input {
  width: 200px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style> 