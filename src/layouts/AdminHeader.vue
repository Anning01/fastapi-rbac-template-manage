<template>
  <div class="admin-header">
    <!-- 左侧区域 -->
    <div class="header-left">
      <div class="toggle-btn" @click="$emit('toggle-sidebar')">
        <el-icon size="20">
          <Fold v-if="!collapsed" />
          <Expand v-else />
        </el-icon>
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="header-right">
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索菜单..."
          :prefix-icon="Search"
          clearable
          class="search-input"
          @input="handleSearch"
        />
      </div>

      <!-- 通知 -->
      <el-badge :value="notificationCount" class="notification-badge">
        <el-button circle class="header-btn">
          <el-icon size="18">
            <Bell />
          </el-icon>
        </el-button>
      </el-badge>

      <!-- 全屏 -->
      <el-button circle class="header-btn" @click="toggleFullscreen">
        <el-icon size="18">
          <FullScreen />
        </el-icon>
      </el-button>

      <!-- 主题切换 -->
      <el-button circle class="header-btn" @click="toggleTheme">
        <el-icon size="18">
          <Sunny v-if="!isDark" />
          <Moon v-else />
        </el-icon>
      </el-button>

      <!-- 用户信息 -->
      <el-dropdown @command="handleCommand" class="user-dropdown">
        <div class="user-info">
          <el-avatar
            :src="userInfo.avatar"
            :size="36"
            class="user-avatar"
          >
            <el-icon><User /></el-icon>
          </el-avatar>
          <span class="username">{{ userInfo.name || '管理员' }}</span>
          <el-icon class="dropdown-icon">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人信息
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Fold,
  Expand,
  Search,
  Bell,
  FullScreen,
  Sunny,
  Moon,
  User,
  ArrowDown,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar', 'logout'])

const searchQuery = ref('')
const isDark = ref(false)
const notificationCount = ref(3)

const userInfo = computed(() => ({
  name: '管理员',
  avatar: ''
}))

const handleSearch = (value) => {
  if (value) {
    ElMessage.info(`搜索: ${value}`)
  }
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  ElMessage.success(isDark.value ? '切换到暗色主题' : '切换到亮色主题')
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('打开个人信息')
      break
    case 'settings':
      ElMessage.info('打开系统设置')
      break
    case 'logout':
      emit('logout')
      break
  }
}
</script>

<style scoped>
.admin-header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.toggle-btn:hover {
  background: var(--secondary-color);
  color: var(--primary-color);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  width: 280px;
}

.search-input {
  --el-input-border-radius: 20px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  background: var(--bg-secondary);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: var(--primary-color);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.header-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.header-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.notification-badge {
  position: relative;
}

.notification-badge :deep(.el-badge__content) {
  background: var(--accent-color);
  border: 2px solid var(--bg-primary);
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  background: var(--bg-primary);
  border: 1px solid transparent;
}

.user-info:hover {
  background: var(--secondary-color);
  border-color: var(--border-color);
}

.user-avatar {
  border: 2px solid var(--border-color);
  transition: all 0.2s ease;
}

.user-info:hover .user-avatar {
  border-color: var(--primary-color);
}

.username {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 14px;
}

.dropdown-icon {
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .search-box {
    display: none;
  }

  .header-right {
    gap: 8px;
  }

  .username {
    display: none;
  }
}
</style>