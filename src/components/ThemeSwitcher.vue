<template>
  <div class="theme-switcher">
    <el-tooltip
      :content="theme === 'light' ? '切换到暗黑模式' : '切换到明亮模式'"
      placement="bottom"
    >
      <el-button
        class="theme-toggle-btn"
        :class="{ 'dark-mode': theme === 'dark' }"
        @click="toggleTheme"
        circle
        size="default"
      >
        <el-icon>
          <Sunny v-if="theme === 'dark'" />
          <Moon v-else />
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { Sunny, Moon } from '@element-plus/icons-vue'

const themeStore = useThemeStore()
const theme = computed(() => themeStore.theme)

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
}

.theme-toggle-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.theme-toggle-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.theme-toggle-btn:hover::before {
  opacity: 1;
}

.theme-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.theme-toggle-btn.dark-mode {
  background: var(--bg-secondary);
}

.theme-toggle-btn .el-icon {
  font-size: 16px;
  transition: all 0.3s ease;
}

.theme-toggle-btn:hover .el-icon {
  transform: rotate(15deg) scale(1.1);
  color: var(--primary-color);
}

/* 动画效果 */
.theme-toggle-btn .el-icon {
  animation: themeIconPulse 2s ease-in-out infinite;
}

@keyframes themeIconPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.theme-toggle-btn:hover .el-icon {
  animation: none;
}
</style>