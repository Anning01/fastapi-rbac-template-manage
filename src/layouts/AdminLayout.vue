<template>
  <el-container class="admin-layout">
    <el-aside :width="sidebarWidth" class="sidebar-container">
      <AdminSidebar
        :collapsed="sidebarCollapsed"
        :menu-list="menuList"
        @menu-select="handleMenuSelect"
      />
    </el-aside>
    <el-container class="main-container">
      <el-header class="header-container">
        <AdminHeader
          :collapsed="sidebarCollapsed"
          @toggle-sidebar="toggleSidebar"
          @logout="handleLogout"
        />
      </el-header>
      <el-main class="content-container">
        <AdminBreadcrumb :items="breadcrumbItems" class="breadcrumb" />
        <div class="page-content">
          <AdminSkeleton v-if="isLoading" />
          <router-view v-else v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" class="animate-fade-in" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useMenuStore } from '@/stores/menu'
import AdminSidebar from './AdminSidebar.vue'
import AdminHeader from './AdminHeader.vue'
import AdminBreadcrumb from '@/components/AdminBreadcrumb.vue'
import AdminSkeleton from '@/components/AdminSkeleton.vue'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()

const sidebarCollapsed = ref(false)
const isLoading = ref(false)

const sidebarWidth = computed(() => sidebarCollapsed.value ? '64px' : '260px')
const menuList = computed(() => menuStore.menuList)
const breadcrumbItems = computed(() => menuStore.getBreadcrumbItems(route.path))

// 初始化菜单
menuStore.fetchMenus()

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleMenuSelect = (path) => {
  if (path && path !== route.path) {
    isLoading.value = true
    router.push(path).finally(() => {
      setTimeout(() => {
        isLoading.value = false
      }, 300) // A small delay to perceive the loading state
    })
  }
}

const handleLogout = () => {
  ElMessageBox.confirm('确认退出登录?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push('/login')
  })
}

watch(route, () => {
  isLoading.value = false
})
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.sidebar-container {
  background: transparent;
  border-right: none;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  position: relative;
  z-index: 100;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.header-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  padding: 0;
  height: var(--header-height, 60px) !important;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset;
  position: relative;
  z-index: 99;
}

.content-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: transparent;
  position: relative;
}

.breadcrumb {
  margin: 20px 24px 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-content {
  padding: 20px 24px 24px;
  min-height: calc(100vh - var(--header-height, 60px) - 80px);
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(1.02);
}

.animate-fade-in {
  animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .breadcrumb {
    margin: 16px;
    padding: 10px 16px;
  }

  .page-content {
    padding: 16px;
  }

  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1001;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar-container:not(.collapsed) {
    transform: translateX(0);
  }

  .main-container {
    width: 100%;
  }

  /* 遮罩层 */
  .admin-layout::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .admin-layout.sidebar-open::before {
    opacity: 1;
    visibility: visible;
  }
}

/* 滚动条样式 */
.content-container::-webkit-scrollbar {
  width: 6px;
}

.content-container::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 3px;
}

.content-container::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.content-container::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

/* 加载状态优化 */
.admin-skeleton {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin: 20px 24px;
  padding: 32px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 内容区域增强 */
.page-content > * {
  position: relative;
  z-index: 1;
}

.page-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.03) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}
</style>