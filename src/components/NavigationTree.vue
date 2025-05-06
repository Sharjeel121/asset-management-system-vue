<template>
  <div class="navigation-tree">
    <el-card>
      <template #header>
        <span>Navigation Tree</span>
      </template>
      <el-tree
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        highlight-current
        accordion
        default-expand-all="false"
        class="tree-root"
      />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'NavigationTree',
  data() {
    return {
      treeData: [
        {
          id: 1,
          label: 'Clients',
          children: [
            {
              id: 2,
              label: 'Acme Industries',
              children: [
                {
                  id: 3,
                  label: 'Paris Factory',
                  children: [
                    {
                      id: 4,
                      label: 'Cabinets (5)',
                      children: [
                        {
                          id: 5,
                          label: 'CAB-001',
                          children: [
                            { id: 6, label: 'Products (12)' }
                          ]
                        },
                        {
                          id: 7,
                          label: 'CAB-002',
                          children: [
                            { id: 8, label: 'Products (8)' }
                          ]
                        }
                      ]
                    },
                    { id: 9, label: 'Computer Workstations (3)' },
                    { id: 10, label: 'Software (7)' }
                  ]
                },
                {
                  id: 11,
                  label: 'Lyon Distribution Center',
                  children: [
                    { id: 12, label: 'Cabinets (3)' }
                  ]
                }
              ]
            },
            {
              id: 13,
              label: 'TechCorp Global',
              children: [
                { id: 14, label: 'Munich Headquarters' },
                { id: 15, label: 'Berlin Factory' },
                { id: 16, label: 'Hamburg Warehouse' }
              ]
            },
            { id: 17, label: 'Electro Systems' }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  }
}
</script>

<style scoped>
.navigation-tree {
  padding: 10px 0;
}
.tree-root {
  background: #f9fbfd;
  border-radius: 4px;
  padding: 8px;
}
</style> 