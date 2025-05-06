<template>
  <div class="reports-container">
    <div class="header-actions">
      <div class="left-actions">
        <el-select v-model="reportType" placeholder="Report Type" size="small" class="report-type-select">
          <el-option label="Automation Products" value="automation-products" />
          <el-option label="Software" value="software" />
        </el-select>
        <el-button @click="exportExcel" size="small">Export to Excel</el-button>
        <el-button @click="exportPDF" size="small">Export to PDF</el-button>
      </div>
      <div class="right-actions">
        <span>Filters:</span>
        <el-select v-model="filterClient" placeholder="Client" size="small" class="filter-select">
          <el-option label="All Clients" value="all" />
          <el-option label="Acme Industries" value="acme" />
          <el-option label="TechCorp Global" value="techcorp" />
        </el-select>
        <el-select v-model="filterManufacturer" placeholder="Manufacturer" size="small" class="filter-select">
          <el-option label="All" value="all" />
          <el-option label="Siemens" value="siemens" />
          <el-option label="Schneider" value="schneider" />
          <el-option label="Allen-Bradley" value="allen-bradley" />
        </el-select>
        <el-select v-model="filterCountry" placeholder="Country" size="small" class="filter-select">
          <el-option label="All" value="all" />
          <el-option label="France" value="france" />
          <el-option label="Germany" value="germany" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="Status" size="small" class="filter-select">
          <el-option label="All" value="all" />
          <el-option label="Active" value="active" />
          <el-option label="Obsolete" value="obsolete" />
        </el-select>
      </div>
    </div>

    <el-card class="reports-card">
      <el-table :data="pagedData" style="width: 100%" v-loading="loading">
        <el-table-column prop="manufacturer" label="Manufacturer" />
        <el-table-column prop="reference" label="Reference" />
        <el-table-column prop="description" label="Description" />
        <el-table-column prop="lifecycle" label="Lifecycle" />
        <el-table-column prop="totalQty" label="Total Qty." width="100" />
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredData.length"
          :page-size="pageSize"
          :current-page.sync="currentPage"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ReportsView',
  data() {
    return {
      loading: false,
      reportType: 'automation-products',
      filterClient: 'all',
      filterManufacturer: 'all',
      filterCountry: 'all',
      filterStatus: 'all',
      currentPage: 1,
      pageSize: 5,
      tableData: [
        {
          manufacturer: 'Siemens',
          reference: '6ES7315-2EH14',
          description: 'CPU 315-2 PN/DP',
          lifecycle: 'Active',
          totalQty: 24
        },
        {
          manufacturer: 'Siemens',
          reference: '6ES7321-1BL00',
          description: 'DI32xDC24V',
          lifecycle: 'Active',
          totalQty: 47
        },
        {
          manufacturer: 'Schneider',
          reference: 'BMXXP342020',
          description: 'M340 CPU',
          lifecycle: 'Active',
          totalQty: 18
        },
        {
          manufacturer: 'Allen-Bradley',
          reference: '1756-L73',
          description: 'ControlLogix CPU',
          lifecycle: 'Active',
          totalQty: 12
        },
        {
          manufacturer: 'Siemens',
          reference: '6GK5206-1BB10',
          description: 'SCALANCE X206-1',
          lifecycle: 'Obsolete',
          totalQty: 8
        }
      ]
    }
  },
  computed: {
    filteredData() {
      return this.tableData.filter(row => {
        const clientMatch = this.filterClient === 'all' || true // Placeholder
        const manufacturerMatch = this.filterManufacturer === 'all' || row.manufacturer.toLowerCase() === this.filterManufacturer
        const countryMatch = this.filterCountry === 'all' || true // Placeholder
        const statusMatch = this.filterStatus === 'all' || row.lifecycle.toLowerCase() === this.filterStatus
        return clientMatch && manufacturerMatch && countryMatch && statusMatch
      })
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredData.slice(start, start + this.pageSize)
    }
  },
  methods: {
    exportExcel() {
      this.$message.success('Exported to Excel!')
    },
    exportPDF() {
      this.$message.success('Exported to PDF!')
    }
  }
}
</script>

<style scoped>
.reports-container {
  padding: 20px;
}
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
}
.left-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.right-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.report-type-select {
  width: 180px;
}
.filter-select {
  width: 140px;
}
.reports-card {
  margin-top: 0;
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style> 