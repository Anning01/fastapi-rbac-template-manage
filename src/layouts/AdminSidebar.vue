<template>
  <div class="sidebar">
    <!-- Logo区域 -->
    <div class="logo-container" :class="{ collapsed: collapsed }">
      <div class="logo">
        <el-icon size="28" color="var(--primary-color)">
          <Setting />
        </el-icon>
        <transition name="fade">
          <span v-if="!collapsed" class="logo-text">管理后台</span>
        </transition>
      </div>
    </div>

    <!-- 菜单区域 -->
    <el-scrollbar class="menu-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :unique-opened="true"
        class="sidebar-menu"
        @select="handleSelect"
      >
        <template v-for="menu in menuList" :key="menu.id">
          <!-- 有子菜单的情况 -->
          <el-sub-menu
            v-if="menu.children && menu.children.length > 0"
            :index="menu.id.toString()"
            class="menu-item"
          >
            <template #title>
              <el-icon>
                <component :is="menu.icon || 'Menu'" />
              </el-icon>
              <span>{{ menu.title }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.children"
              :key="child.id"
              :index="child.path"
              class="submenu-item"
              @click="selectMenu(child)"
            >
              <el-icon>
                <component :is="child.icon || 'Document'" />
              </el-icon>
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 没有子菜单的情况 -->
          <el-menu-item
            v-else
            :index="menu.path"
            class="menu-item"
            @click="selectMenu(menu)"
          >
            <el-icon>
              <component :is="menu.icon || 'Menu'" />
            </el-icon>
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>

    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="$emit('toggle-sidebar')">
      <el-icon>
        <Fold v-if="!collapsed" />
        <Expand v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  menuList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['menu-select', 'toggle-sidebar'])

const route = useRoute()

const activeMenu = computed(() => route.path)

const handleSelect = (index) => {
  // Element Plus 菜单选择处理
}

const selectMenu = (menu) => {
  emit('menu-select', menu)
}
</script>

<style scoped>
.sidebar {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  position: relative;
}

.logo-container {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
  padding: 0 16px;
  transition: all 0.3s ease;
}

.logo-container.collapsed {
  padding: 0 8px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 18px;
  color: var(--text-primary);
}

.logo-text {
  white-space: nowrap;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.menu-scrollbar {
  flex: 1;
  overflow: hidden;
}

.sidebar-menu {
  border: none;
  background: transparent;
  padding: 8px;
}

.menu-item {
  margin: 4px 0;
  border-radius: var(--radius-md) !important;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: var(--secondary-color) !important;
  transform: translateX(2px);
}

.menu-item.is-active {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light)) !important;
  color: white !important;
  box-shadow: var(--shadow-sm);
}

.submenu-item {
  margin: 2px 0;
  border-radius: var(--radius-sm) !important;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  background: rgba(99, 102, 241, 0.1) !important;
  color: var(--primary-color) !important;
}

.submenu-item.is-active {
  background: var(--primary-color) !important;
  color: white !important;
}

.collapse-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.collapse-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(-50%) translateY(-2px);
  box-shadow: var(--shadow-md);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>