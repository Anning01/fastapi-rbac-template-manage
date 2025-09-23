<template>
  <div class="placeholder-page">
    <div class="placeholder-content card">
      <div class="placeholder-icon">
        <el-icon size="64" color="#e5e7eb">
          <component :is="pageIcon" />
        </el-icon>
      </div>
      <h2>{{ pageTitle }}</h2>
      <p class="placeholder-desc">{{ pageDesc }}</p>
      <el-button type="primary">开始配置</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageConfig = {
  '/users/roles': {
    title: '角色管理',
    desc: '在这里可以管理系统角色和权限配置',
    icon: 'Avatar'
  },
  '/users/permissions': {
    title: '权限管理',
    desc: '配置和管理系统权限',
    icon: 'Key'
  },
  '/system/menus': {
    title: '菜单管理',
    desc: '配置系统菜单结构',
    icon: 'Menu'
  },
  '/system/settings': {
    title: '系统设置',
    desc: '系统基础配置和参数设置',
    icon: 'Tools'
  },
  '/system/logs': {
    title: '操作日志',
    desc: '查看系统操作记录和日志',
    icon: 'Document'
  },
  '/analytics/users': {
    title: '用户统计',
    desc: '用户数据分析和统计报表',
    icon: 'TrendCharts'
  },
  '/analytics/monitor': {
    title: '系统监控',
    desc: '实时监控系统状态和性能',
    icon: 'Monitor'
  }
}

const currentConfig = computed(() => {
  return pageConfig[route.path] || {
    title: '页面开发中',
    desc: '该页面正在开发中，敬请期待',
    icon: 'Tools'
  }
})

const pageTitle = computed(() => currentConfig.value.title)
const pageDesc = computed(() => currentConfig.value.desc)
const pageIcon = computed(() => currentConfig.value.icon)
</script>

<style scoped>
.placeholder-page {
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  padding: 60px 40px;
  max-width: 400px;
}

.placeholder-content h2 {
  margin: 20px 0 16px 0;
  color: var(--text-primary);
}

.placeholder-desc {
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}
</style>