<template>
  <div class="home-container">
    <h2>Dashboard</h2>
    <el-row :gutter="20" class="stats-row">
      <el-col :span="4">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Clients</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.totalClients }}</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Sites</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.totalSites }}</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Projects</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.totalProjects }}</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Cabinets</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.totalCabinets }}</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Products</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.totalProducts }}</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Software</span>
            </div>
          </template>
          <div class="stat-value">{{ stats.totalSoftware }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="recent-activity-row">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Recent Activities</span>
            </div>
          </template>
          <ul class="recent-activity-list">
            <li v-for="(activity, index) in recentActivities" :key="index">
              - {{ activity.description }} ({{ activity.timeAgo }})
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      stats: {
        totalClients: 24,
        totalSites: 42,
        totalProjects: 156,
        totalCabinets: 310,
        totalProducts: 2945,
        totalSoftware: 523
      },
      recentActivities: [
        {
          description: 'New cabinet added at Site XYZ',
          timeAgo: '2 hours ago'
        },
        {
          description: 'Software updated at Client ABC',
          timeAgo: '1 day ago'
        },
        {
          description: 'New project created for Client DEF',
          timeAgo: '2 days ago'
        }
      ]
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.stats-row {
  margin-bottom: 30px;
}

.stat-card {
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #1976d2;
  text-align: center;
  margin-top: 10px;
}

.recent-activity-row {
  margin-top: 30px;
}

.recent-activity-list {
  list-style: none;
  padding-left: 0;
  font-size: 16px;
}

.recent-activity-list li {
  margin-bottom: 8px;
}
</style> 