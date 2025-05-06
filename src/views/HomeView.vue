<template>
  <div class="home-container">
    <h2 class="mb-4">Dashboard</h2>
    <el-row :gutter="18" class="stats-row">
      <el-col
        v-for="(stat, i) in statList"
        :key="i"
        :xs="12" :sm="12" :md="8" :lg="4" :xl="4"
      >
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>{{ stat.label }}</span>
            </div>
          </template>
          <div class="stat-value">{{ stat.value }}</div>
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
      statList: [
        { label: 'Total Clients', value: 24 },
        { label: 'Total Sites', value: 42 },
        { label: 'Total Projects', value: 156 },
        { label: 'Total Cabinets', value: 310 },
        { label: 'Total Products', value: 2945 },
        { label: 'Total Software', value: 523 }
      ],
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
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(25, 118, 210, 0.10);
  border-radius: 14px;
  background: #fff;
  transition: box-shadow 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 24px 0 rgba(25, 118, 210, 0.18);
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.stat-value {
  font-size: 2.1rem;
  font-weight: 700;
  color: #1976d2;
  text-align: center;
  letter-spacing: 1px;
}

@media (max-width: 900px) {
  .stat-card {
    width: 100%;
    min-width: unset;
  }
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