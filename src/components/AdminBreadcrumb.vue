<template>
  <div class="admin-breadcrumb">
    <el-breadcrumb separator="/" class="breadcrumb-nav">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbItems"
        :key="index"
        :to="item.path && index !== breadcrumbItems.length - 1 ? item.path : undefined"
        :class="{ 'is-current': index === breadcrumbItems.length - 1 }"
      >
        <template v-if="item.icon">
          <el-icon class="breadcrumb-icon">
            <component :is="item.icon" />
          </el-icon>
        </template>
        <span class="breadcrumb-text">{{ item.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 右侧操作区域 -->
    <div class="breadcrumb-actions" v-if="showActions">
      <el-button
        v-if="showRefresh"
        circle
        size="small"
        class="action-btn"
        @click="handleRefresh"
      >
        <el-icon>
          <Refresh />
        </el-icon>
      </el-button>

      <el-button
        v-if="showFullscreen"
        circle
        size="small"
        class="action-btn"
        @click="handleFullscreen"
      >
        <el-icon>
          <FullScreen />
        </el-icon>
      </el-button>

      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { title: '首页', path: '/dashboard', icon: 'House' }
    ]
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showRefresh: {
    type: Boolean,
    default: true
  },
  showFullscreen: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['refresh', 'fullscreen'])
const router = useRouter()

const breadcrumbItems = computed(() => {
  if (!props.items || props.items.length === 0) {
    return [{ title: '首页', path: '/dashboard', icon: 'House' }]
  }
  return props.items
})

const handleRefresh = () => {
  emit('refresh')
  ElMessage.success('页面已刷新')

  // 页面刷新逻辑
  const currentPath = router.currentRoute.value.path
  router.replace({ path: '/redirect' + currentPath })
}

const handleFullscreen = () => {
  emit('fullscreen')

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      ElMessage.success('已进入全屏模式')
    }).catch(() => {
      ElMessage.error('全屏模式失败')
    })
  } else {
    document.exitFullscreen().then(() => {
      ElMessage.success('已退出全屏模式')
    })
  }
}
</script>

<style scoped>
.admin-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  background: transparent;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.breadcrumb-nav {
  flex: 1;
}

.breadcrumb-nav :deep(.el-breadcrumb__item) {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.breadcrumb-nav :deep(.el-breadcrumb__inner) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  text-decoration: none;
}

.breadcrumb-nav :deep(.el-breadcrumb__inner:hover) {
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.1);
}

.breadcrumb-nav :deep(.el-breadcrumb__inner.is-link) {
  cursor: pointer;
}

.breadcrumb-nav :deep(.is-current .el-breadcrumb__inner) {
  color: var(--text-primary);
  font-weight: 600;
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.breadcrumb-nav :deep(.is-current .el-breadcrumb__inner:hover) {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.breadcrumb-icon {
  font-size: 16px;
  color: inherit;
}

.breadcrumb-text {
  white-space: nowrap;
}

.breadcrumb-nav :deep(.el-breadcrumb__separator) {
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0 8px;
}

.breadcrumb-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.action-btn:active {
  transform: translateY(0);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .admin-breadcrumb {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .breadcrumb-actions {
    margin-left: 0;
    align-self: flex-end;
  }

  .breadcrumb-nav :deep(.el-breadcrumb__inner) {
    padding: 4px 8px;
    font-size: 13px;
  }

  .breadcrumb-text {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 动画效果 */
.admin-breadcrumb {
  animation: breadcrumb-slide-in 0.3s ease-out;
}

@keyframes breadcrumb-slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .admin-breadcrumb {
    background: rgba(0, 0, 0, 0.1);
  }

  .breadcrumb-nav :deep(.el-breadcrumb__inner:hover) {
    background: rgba(99, 102, 241, 0.2);
  }

  .breadcrumb-nav :deep(.is-current .el-breadcrumb__inner) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
}
</style>