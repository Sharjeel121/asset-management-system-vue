<template>
  <div class="home-container">
    <h2 class="mb-4">Dashboard</h2>
    <!-- <p>
      {{ statList }}
    </p> -->
    <el-row :gutter="18" class="stats-row">
      <el-col
        :xs="12" :sm="12" :md="8" :lg="4" :xl="4"
      >
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span> Total Clients</span>
            </div>
          </template>
          <div class="stat-value"> {{statList?.clients || '-'}}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4" >
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Sites </span>
            </div>
          </template>
          <div class="stat-value">{{statList?.sides || '-'}}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4" >
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Projects </span>
            </div>
          </template>
          <div class="stat-value">{{statList?.projects || '-'}} </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4" >
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Cabinets </span>
            </div>
          </template>
          <div class="stat-value">{{statList?.cabinets || '-'}}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4" >
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Products </span>
            </div>
          </template>
          <div class="stat-value">{{statList?.products || '-'}}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4" >
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Software </span>
            </div>
          </template>
          <div class="stat-value">{{statList?.software || '-'}}</div>
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
          <ul
          v-loading="loading"
          element-loading-text="Loading..."
          :element-loading-spinner="svg"
          class="recent-activity-list">
            <li v-if="recentActivities.length" v-for="(item, index) in recentActivities" :key="index">
             - {{ item?.activity }}
            </li>
            <li v-else>
              - No activity yet
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import appRequest from '@/helpers/request'
import {dashboardStore} from '../stores/dashboardStore'
export default {
  name: 'HomeView',
  data() {
    return {
      loading: true,
      dashboardStore: dashboardStore(),
      statList: {},
      recentActivities: [
      ]
    }
  },
  async mounted(){
    if (!this.dashboardStore.countData) {
      await this.dashboardStore.getDashCount()
    }
    this.setCount()
    this.setRecentAct()

  },
  methods: {  
    setCount(){
      this.statList = this.dashboardStore.countData
    },
    async setRecentAct(){
      try {
        const resp = await appRequest.get('/logs')
        this.recentActivities = resp.data
        this.loading= false
      } catch (error) {
          console.log(error);
      };
      
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