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

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleMenuSelect = (menuItem) => {
  if (menuItem.path && menuItem.path !== route.path) {
    isLoading.value = true
    router.push(menuItem.path).finally(() => {
      setTimeout(() => {
        isLoading.value = false
      }, 300)
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
}

.sidebar-container {
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  transition: width 0.3s ease;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header-container {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 0;
  height: var(--header-height) !important;
  box-shadow: var(--shadow-sm);
}

.content-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: var(--bg-secondary);
}

.breadcrumb {
  margin: 16px 24px 0;
}

.page-content {
  padding: 16px 24px 24px;
  min-height: calc(100vh - var(--header-height) - 60px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>