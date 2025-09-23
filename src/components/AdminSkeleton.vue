<template>
  <div class="admin-skeleton">
    <!-- 页面标题骨架 -->
    <div class="skeleton-header">
      <div class="skeleton-title"></div>
      <div class="skeleton-subtitle"></div>
    </div>

    <!-- 操作按钮骨架 -->
    <div class="skeleton-actions">
      <div class="skeleton-btn" v-for="i in 3" :key="i"></div>
    </div>

    <!-- 表格/卡片内容骨架 -->
    <div class="skeleton-content">
      <!-- 卡片列表模式 -->
      <div v-if="type === 'card'" class="skeleton-cards">
        <div
          v-for="i in cardCount"
          :key="i"
          class="skeleton-card card"
        >
          <div class="card-header">
            <div class="skeleton-avatar"></div>
            <div class="card-info">
              <div class="skeleton-line skeleton-line-lg"></div>
              <div class="skeleton-line skeleton-line-md"></div>
            </div>
          </div>
          <div class="card-body">
            <div class="skeleton-line" v-for="j in 3" :key="j"></div>
          </div>
          <div class="card-footer">
            <div class="skeleton-tag" v-for="k in 2" :key="k"></div>
          </div>
        </div>
      </div>

      <!-- 表格模式 -->
      <div v-else-if="type === 'table'" class="skeleton-table">
        <div class="table-header">
          <div
            v-for="i in columnCount"
            :key="i"
            class="table-header-cell"
          >
            <div class="skeleton-line skeleton-line-sm"></div>
          </div>
        </div>
        <div class="table-body">
          <div
            v-for="i in rowCount"
            :key="i"
            class="table-row"
          >
            <div
              v-for="j in columnCount"
              :key="j"
              class="table-cell"
            >
              <div class="skeleton-line" :class="getRandomLineClass()"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 表单模式 -->
      <div v-else-if="type === 'form'" class="skeleton-form">
        <div class="form-section" v-for="section in 2" :key="section">
          <div class="section-title">
            <div class="skeleton-line skeleton-line-md"></div>
          </div>
          <div class="form-grid">
            <div
              v-for="i in 6"
              :key="i"
              class="form-item"
            >
              <div class="form-label">
                <div class="skeleton-line skeleton-line-sm"></div>
              </div>
              <div class="form-input">
                <div class="skeleton-input"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 默认混合模式 -->
      <div v-else class="skeleton-mixed">
        <!-- 统计卡片 -->
        <div class="stats-grid">
          <div v-for="i in 4" :key="i" class="stat-card card">
            <div class="stat-icon">
              <div class="skeleton-circle"></div>
            </div>
            <div class="stat-content">
              <div class="skeleton-line skeleton-line-lg"></div>
              <div class="skeleton-line skeleton-line-sm"></div>
            </div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="chart-section">
          <div class="chart-card card">
            <div class="chart-header">
              <div class="skeleton-line skeleton-line-md"></div>
              <div class="skeleton-line skeleton-line-sm"></div>
            </div>
            <div class="chart-body">
              <div class="skeleton-chart"></div>
            </div>
          </div>
        </div>

        <!-- 列表区域 -->
        <div class="list-section">
          <div class="list-card card">
            <div class="list-header">
              <div class="skeleton-line skeleton-line-md"></div>
            </div>
            <div class="list-body">
              <div v-for="i in 5" :key="i" class="list-item">
                <div class="skeleton-avatar"></div>
                <div class="item-content">
                  <div class="skeleton-line skeleton-line-lg"></div>
                  <div class="skeleton-line skeleton-line-md"></div>
                </div>
                <div class="item-action">
                  <div class="skeleton-btn-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'mixed', // mixed, card, table, form
    validator: (value) => ['mixed', 'card', 'table', 'form'].includes(value)
  },
  cardCount: {
    type: Number,
    default: 6
  },
  rowCount: {
    type: Number,
    default: 8
  },
  columnCount: {
    type: Number,
    default: 5
  }
})

const getRandomLineClass = () => {
  const classes = ['skeleton-line-sm', 'skeleton-line-md', 'skeleton-line-lg']
  return classes[Math.floor(Math.random() * classes.length)]
}
</script>

<style scoped>
.admin-skeleton {
  padding: 20px;
  animation: skeleton-fade 0.3s ease-in-out;
}

@keyframes skeleton-fade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 骨架屏基础样式 */
.skeleton-line,
.skeleton-avatar,
.skeleton-circle,
.skeleton-btn,
.skeleton-btn-sm,
.skeleton-input,
.skeleton-tag,
.skeleton-chart {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 页面标题骨架 */
.skeleton-header {
  margin-bottom: 24px;
}

.skeleton-title {
  width: 200px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-md);
  margin-bottom: 8px;
}

.skeleton-subtitle {
  width: 300px;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-sm);
}

/* 操作按钮骨架 */
.skeleton-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.skeleton-btn {
  width: 80px;
  height: 36px;
}

.skeleton-btn-sm {
  width: 60px;
  height: 28px;
}

/* 线条大小变体 */
.skeleton-line {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-line-sm {
  width: 60px;
}

.skeleton-line-md {
  width: 120px;
}

.skeleton-line-lg {
  width: 180px;
}

/* 头像和图标 */
.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

/* 卡片骨架 */
.skeleton-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.skeleton-card {
  padding: 20px;
}

.card-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.card-info {
  flex: 1;
}

.card-body {
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  gap: 8px;
}

.skeleton-tag {
  width: 60px;
  height: 24px;
  border-radius: 12px;
}

/* 表格骨架 */
.skeleton-table {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: repeat(var(--column-count, 5), 1fr);
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.table-body {
  padding: 16px;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(var(--column-count, 5), 1fr);
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.table-row:last-child {
  border-bottom: none;
}

/* 表单骨架 */
.skeleton-form {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  margin-bottom: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-input {
  height: 40px;
  border-radius: var(--radius-md);
}

/* 混合模式骨架 */
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
  padding: 20px;
}

.stat-content {
  flex: 1;
}

.chart-section {
  margin-bottom: 24px;
}

.chart-card {
  padding: 24px;
}

.chart-header {
  margin-bottom: 20px;
}

.skeleton-chart {
  height: 300px;
  border-radius: var(--radius-md);
}

.list-card {
  padding: 24px;
}

.list-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.list-item:last-child {
  border-bottom: none;
}

.item-content {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .skeleton-cards {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>