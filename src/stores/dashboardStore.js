import appRequest from '@/helpers/request'
import { defineStore } from 'pinia'
export const dashboardStore = defineStore('dashboardStore', {
    state: () => ({
      countData: null
    }),
    actions: {
      async getDashCount() {
        try {
          const resp = await appRequest.get('dashboard')
          this.countData = resp.data
        } catch (error) {
            console.log(error);
        };
        
      }
}
})
