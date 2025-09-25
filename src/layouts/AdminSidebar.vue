<template>
  <div class="modern-sidebar" :class="{ collapsed: collapsed }">
    <!-- Logo区域 -->
    <div class="logo-container">
      <div class="logo">
        <div class="logo-icon">
          <el-icon size="28">
            <Setting />
          </el-icon>
        </div>
        <transition name="fade-slide">
          <div v-if="!collapsed" class="logo-content">
            <span class="logo-text">管理后台</span>
            <span class="logo-subtitle">Admin Panel</span>
          </div>
        </transition>
      </div>
    </div>

    <!-- 菜单区域 -->
    <div class="menu-container">
      <el-scrollbar class="menu-scrollbar" view-class="menu-scroll-view">
        <div class="menu-wrapper">
          <template v-for="menu in menuList" :key="menu.id">
            <!-- 有子菜单的情况 -->
            <div
              v-if="menu.children && menu.children.length > 0"
              class="menu-group"
            >
              <!-- 折叠状态下的子菜单处理 -->
              <el-popover
                v-if="collapsed"
                placement="right-start"
                :width="200"
                trigger="hover"
                popper-class="sidebar-submenu-popover"
              >
                <template #reference>
                  <div
                    class="menu-parent"
                    :class="{
                      active: isParentActive(menu)
                    }"
                  >
                    <div class="menu-parent-content">
                      <div class="menu-icon-wrapper">
                        <el-icon class="menu-icon">
                          <component :is="menu.icon || 'Menu'" />
                        </el-icon>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="popover-submenu">
                  <div class="popover-title">{{ menu.title }}</div>
                  <div
                    v-for="child in menu.children"
                    :key="child.id"
                    class="popover-submenu-item"
                    :class="{ active: activeMenu === child.fullPath }"
                    @click="handleMenuClick(child.fullPath)"
                  >
                    <el-icon class="popover-submenu-icon">
                      <component :is="child.icon || 'Document'" />
                    </el-icon>
                    <span>{{ child.title }}</span>
                  </div>
                </div>
              </el-popover>

              <!-- 展开状态下的子菜单 -->
              <div v-else>
                <div
                  class="menu-parent"
                  :class="{
                    active: isParentActive(menu),
                    expanded: expandedMenus.includes(menu.id)
                  }"
                  @click="toggleSubmenu(menu)"
                >
                  <div class="menu-parent-content">
                    <div class="menu-icon-wrapper">
                      <el-icon class="menu-icon">
                        <component :is="menu.icon || 'Menu'" />
                      </el-icon>
                    </div>
                    <div class="menu-text-wrapper">
                      <span class="menu-title">{{ menu.title }}</span>
                      <el-icon class="expand-icon" :class="{ rotated: expandedMenus.includes(menu.id) }">
                        <ArrowDown />
                      </el-icon>
                    </div>
                  </div>
                </div>

                <!-- 子菜单 -->
                <transition name="submenu-slide">
                  <div
                    v-show="expandedMenus.includes(menu.id)"
                    class="submenu-container"
                  >
                    <div
                      v-for="child in menu.children"
                      :key="child.id"
                      class="submenu-item"
                      :class="{ active: activeMenu === child.fullPath }"
                      @click="handleMenuClick(child.fullPath)"
                    >
                      <div class="submenu-indicator"></div>
                      <div class="submenu-content">
                        <el-icon class="submenu-icon">
                          <component :is="child.icon || 'Document'" />
                        </el-icon>
                        <span class="submenu-title">{{ child.title }}</span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>

            <!-- 没有子菜单的情况 -->
            <div
              v-else
              class="menu-item"
              :class="{ active: activeMenu === menu.fullPath }"
              @click="handleMenuClick(menu.fullPath)"
            >
              <div class="menu-item-content">
                <div class="menu-icon-wrapper">
                  <el-icon class="menu-icon">
                    <component :is="menu.icon || 'Menu'" />
                  </el-icon>
                </div>
                <transition name="fade-slide">
                  <div v-if="!collapsed" class="menu-text-wrapper">
                    <span class="menu-title">{{ menu.title }}</span>
                  </div>
                </transition>
              </div>
            </div>
          </template>
        </div>
      </el-scrollbar>
    </div>


  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Setting, ArrowDown } from '@element-plus/icons-vue'

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

const emit = defineEmits(['menu-select'])

const route = useRoute()
const router = useRouter()

// 展开的菜单
const expandedMenus = ref([])

const activeMenu = computed(() => route.path)

// 判断父菜单是否激活
const isParentActive = (menu) => {
  if (!menu.children) return false
  return menu.children.some(child => child.fullPath === activeMenu.value)
}

// 切换子菜单展开/收起
const toggleSubmenu = (menu) => {
  const index = expandedMenus.value.indexOf(menu.id)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(menu.id)
  }
}

// 处理菜单点击
const handleMenuClick = (path) => {
  if (!path) return

  emit('menu-select', path)
  router.push(path)
}

// 监听路由变化，自动展开对应的父菜单
watch(() => route.path, (newPath) => {
  props.menuList.forEach(menu => {
    if (menu.children) {
      const hasActiveChild = menu.children.some(child => child.fullPath === newPath)
      if (hasActiveChild && !expandedMenus.value.includes(menu.id)) {
        expandedMenus.value.push(menu.id)
      }
    }
  })
}, { immediate: true })

// 监听折叠状态变化
watch(() => props.collapsed, (collapsed) => {
  if (collapsed) {
    expandedMenus.value = []
  } else {
    // 展开当前激活菜单的父菜单
    props.menuList.forEach(menu => {
      if (menu.children) {
        const hasActiveChild = menu.children.some(child => child.fullPath === route.path)
        if (hasActiveChild && !expandedMenus.value.includes(menu.id)) {
          expandedMenus.value.push(menu.id)
        }
      }
    })
  }
})
</script>

<style scoped>
/* 主容器 */
.modern-sidebar {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.95) 50%,
    rgba(241, 245, 249, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow:
    4px 0 24px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  width: 260px;
}

.modern-sidebar.collapsed {
  width: 80px;
}

/* Logo区域 */
.logo-container {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow:
    0 8px 25px rgba(102, 126, 234, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  transition: all 0.3s ease;
}

.logo-icon:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 12px 35px rgba(102, 126, 234, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset;
}

.logo-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 菜单容器 */
.menu-container {
  flex: 1;
  overflow: hidden;
}

.menu-scrollbar {
  height: 100%;
}

.menu-scroll-view {
  padding: 16px 0;
}

.menu-wrapper {
  padding: 0 16px;
}

/* 菜单组 */
.menu-group {
  margin-bottom: 8px;
}

/* 父菜单项 */
.menu-parent {
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.menu-parent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.08) 0%,
    rgba(118, 75, 162, 0.08) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-parent:hover::before {
  opacity: 1;
}

.menu-parent.active::before {
  opacity: 1;
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.15) 0%,
    rgba(118, 75, 162, 0.15) 100%
  );
}

.menu-parent-content {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  position: relative;
  z-index: 1;
}

.menu-parent.active .menu-parent-content {
  color: #667eea;
  font-weight: 600;
}

/* 单独的菜单项 */
.menu-item {
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.08) 0%,
    rgba(118, 75, 162, 0.08) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-item:hover::before {
  opacity: 1;
}

.menu-item.active::before {
  opacity: 1;
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.15) 0%,
    rgba(118, 75, 162, 0.15) 100%
  );
}

.menu-item.active {
  box-shadow:
    0 4px 12px rgba(102, 126, 234, 0.15),
    0 0 0 1px rgba(102, 126, 234, 0.1) inset;
}

.menu-item-content {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  position: relative;
  z-index: 1;
}

.menu-item.active .menu-item-content {
  color: #667eea;
  font-weight: 600;
}

/* 图标包装器 */
.menu-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(241, 245, 249, 0.8);
  margin-right: 12px;
  transition: all 0.3s ease;
  position: relative;
}

.menu-item.active .menu-icon-wrapper,
.menu-parent.active .menu-icon-wrapper {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.05);
}

.menu-icon {
  font-size: 18px;
  color: #64748b;
  transition: all 0.3s ease;
}

.menu-item.active .menu-icon,
.menu-parent.active .menu-icon {
  color: #667eea;
  transform: scale(1.1);
}

/* 文本包装器 */
.menu-text-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.3s ease;
}

.expand-icon {
  font-size: 14px;
  color: #64748b;
  transition: all 0.3s ease;
  margin-left: 8px;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.menu-parent.active .expand-icon {
  color: #667eea;
}

/* 子菜单容器 */
.submenu-container {
  margin-left: 12px;
  margin-top: 4px;
  border-left: 2px solid rgba(226, 232, 240, 0.6);
  padding-left: 8px;
}

/* 子菜单项 */
.submenu-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.submenu-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateX(2px);
}

.submenu-item.active {
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.12) 0%,
    rgba(118, 75, 162, 0.12) 100%
  );
  color: #667eea;
  font-weight: 600;
  transform: translateX(4px);
}

.submenu-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #cbd5e1;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.submenu-item.active .submenu-indicator {
  background: #667eea;
  transform: scale(1.5);
}

.submenu-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.submenu-icon {
  font-size: 16px;
  color: #64748b;
  transition: all 0.3s ease;
}

.submenu-item.active .submenu-icon {
  color: #667eea;
  transform: scale(1.1);
}

.submenu-title {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.submenu-item.active .submenu-title {
  color: #667eea;
}

/* Popover子菜单样式 */
.popover-submenu {
  padding: 8px 0;
}

.popover-title {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 4px;
}

.popover-submenu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  color: #475569;
}

.popover-submenu-item:hover {
  background: #f8fafc;
  color: #667eea;
}

.popover-submenu-item.active {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-weight: 600;
}

.popover-submenu-icon {
  font-size: 16px;
}

/* 动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.submenu-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.submenu-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.submenu-slide-enter-from,
.submenu-slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.submenu-slide-enter-to,
.submenu-slide-leave-from {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modern-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transform: translateX(-100%);
  }

  .modern-sidebar:not(.collapsed) {
    transform: translateX(0);
  }
}

/* 滚动条样式 */
.menu-scrollbar :deep(.el-scrollbar__bar.is-vertical) {
  right: 2px;
  width: 4px;
}

.menu-scrollbar :deep(.el-scrollbar__thumb) {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 2px;
}

.menu-scrollbar :deep(.el-scrollbar__thumb:hover) {
  background: rgba(102, 126, 234, 0.5);
}

/* 特殊状态 */
.modern-sidebar.collapsed .menu-wrapper {
  padding: 0 12px;
}

.modern-sidebar.collapsed .menu-icon-wrapper {
  margin-right: 0;
  width: 44px;
  height: 44px;
}

.modern-sidebar.collapsed .menu-parent-content,
.modern-sidebar.collapsed .menu-item-content {
  justify-content: center;
  padding: 14px 8px;
}
</style>
