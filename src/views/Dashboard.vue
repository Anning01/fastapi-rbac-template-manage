<template>
  <div class="dashboard-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner card">
      <div class="banner-content">
        <div class="welcome-text">
          <h1 class="welcome-title">
            <el-icon class="title-icon">
              <Sunny />
            </el-icon>
            欢迎回来！
          </h1>
          <p class="welcome-subtitle">今天是个美好的一天，准备好开始工作了吗？</p>
        </div>
        <div class="banner-actions">
          <el-button type="primary" class="btn-primary">
            <el-icon><Plus /></el-icon>
            新建项目
          </el-button>
          <el-button>
            <el-icon><Document /></el-icon>
            查看文档
          </el-button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card card" v-for="stat in statsData" :key="stat.id">
        <div class="stat-icon" :style="{ background: stat.color }">
          <el-icon :size="24">
            <component :is="stat.icon" />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-trend" :class="stat.trend > 0 ? 'positive' : 'negative'">
            <el-icon>
              <CaretTop v-if="stat.trend > 0" />
              <CaretBottom v-else />
            </el-icon>
            {{ Math.abs(stat.trend) }}%
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- 图表区域 -->
      <div class="chart-section">
        <div class="chart-card card">
          <div class="card-header">
            <h3>数据趋势</h3>
            <el-select v-model="selectedPeriod" size="small">
              <el-option label="最近7天" value="7d" />
              <el-option label="最近30天" value="30d" />
              <el-option label="最近3个月" value="3m" />
            </el-select>
          </div>
          <div class="chart-placeholder">
            <el-icon size="48" color="#e5e7eb">
              <TrendCharts />
            </el-icon>
            <p>图表组件位置</p>
            <p class="chart-desc">集成您喜欢的图表库 (Chart.js, ECharts等)</p>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions">
        <div class="actions-card card">
          <div class="card-header">
            <h3>快速操作</h3>
          </div>
          <div class="actions-grid">
            <div
              v-for="action in quickActions"
              :key="action.id"
              class="action-item"
              @click="handleAction(action)"
            >
              <div class="action-icon">
                <el-icon>
                  <component :is="action.icon" />
                </el-icon>
              </div>
              <span class="action-label">{{ action.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <div class="activity-card card">
        <div class="card-header">
          <h3>最近活动</h3>
          <el-button text>查看全部</el-button>
        </div>
        <div class="activity-list">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-avatar">
              <el-avatar :size="32" :src="activity.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
            </div>
            <div class="activity-content">
              <div class="activity-text">
                <strong>{{ activity.user }}</strong> {{ activity.action }}
                <span class="activity-target">{{ activity.target }}</span>
              </div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
            <div class="activity-type">
              <el-tag :type="activity.type" size="small">
                {{ activity.typeLabel }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const selectedPeriod = ref('7d')

const statsData = ref([
  {
    id: 1,
    label: '总用户数',
    value: '2,547',
    trend: 12,
    icon: 'User',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    label: '今日访问',
    value: '1,423',
    trend: -5,
    icon: 'View',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    label: '订单总数',
    value: '8,926',
    trend: 18,
    icon: 'ShoppingCart',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    label: '收入统计',
    value: '¥45,280',
    trend: 8,
    icon: 'Money',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
])

const quickActions = ref([
  { id: 1, label: '用户管理', icon: 'User', path: '/users/list' },
  { id: 2, label: '新增用户', icon: 'UserFilled', action: 'add-user' },
  { id: 3, label: '系统设置', icon: 'Setting', path: '/system/settings' },
  { id: 4, label: '数据导出', icon: 'Download', action: 'export-data' },
  { id: 5, label: '权限配置', icon: 'Key', path: '/users/permissions' },
  { id: 6, label: '操作日志', icon: 'Document', path: '/system/logs' }
])

const recentActivities = ref([
  {
    id: 1,
    user: '张三',
    action: '创建了新用户',
    target: '"李四"',
    time: '2分钟前',
    type: 'success',
    typeLabel: '创建',
    avatar: ''
  },
  {
    id: 2,
    user: '王五',
    action: '修改了角色权限',
    target: '"管理员"',
    time: '5分钟前',
    type: 'warning',
    typeLabel: '修改',
    avatar: ''
  },
  {
    id: 3,
    user: '赵六',
    action: '删除了菜单',
    target: '"旧功能模块"',
    time: '10分钟前',
    type: 'danger',
    typeLabel: '删除',
    avatar: ''
  },
  {
    id: 4,
    user: '孙七',
    action: '登录了系统',
    target: '',
    time: '15分钟前',
    type: 'info',
    typeLabel: '登录',
    avatar: ''
  }
])

const handleAction = (action) => {
  if (action.path) {
    // 路由跳转
    ElMessage.info(`跳转到：${action.label}`)
  } else {
    // 执行操作
    ElMessage.success(`执行操作：${action.label}`)
  }
}

onMounted(() => {
  // 页面加载完成
})
</script>

<style scoped>
.dashboard-container {
  padding: 0;
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px;
  position: relative;
  z-index: 1;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  color: #ffd700;
}

.welcome-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.banner-actions {
  display: flex;
  gap: 12px;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.stat-trend.positive {
  color: #10b981;
}

.stat-trend.negative {
  color: #ef4444;
}

/* 仪表盘网格 */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* 图表区域 */
.chart-card {
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 2px dashed var(--border-color);
}

.chart-desc {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 8px 0 0 0;
}

/* 快速操作 */
.actions-card {
  padding: 24px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-item:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
}

.action-item:hover .action-icon {
  background: rgba(255, 255, 255, 0.2);
}

.action-label {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

/* 活动区域 */
.activity-card {
  padding: 24px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: white;
  box-shadow: var(--shadow-sm);
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.activity-target {
  color: var(--primary-color);
  font-weight: 500;
}

.activity-time {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .banner-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .welcome-title {
    font-size: 24px;
  }

  .banner-content {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>