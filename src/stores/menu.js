import { defineStore } from 'pinia'
import { ref } from 'vue'
import router, { generateMenuFromRoutes } from '@/router'

// Helper function to add fullPath to menu items
const processMenusWithFullPath = (menus, parentPath = '') => {
  return menus.map(menu => {
    const fullPath = menu.path.startsWith('/')
      ? menu.path
      : `${parentPath}/${menu.path}`.replace(/\/\/+/g, '/');

    const processedMenu = { ...menu, fullPath };

    if (menu.children) {
      processedMenu.children = processMenusWithFullPath(menu.children, fullPath);
    }

    return processedMenu;
  });
};

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref([])
  const menuLoading = ref(false)
  const currentPath = ref('')

  // 从路由配置生成菜单
  const generateMenusFromRouter = () => {
    menuLoading.value = true
    try {
      const routes = router.getRoutes()
      const generatedMenus = generateMenuFromRoutes(routes)
      menuList.value = processMenusWithFullPath(generatedMenus)
    } catch (error) {
      console.error('生成菜单失败:', error)
    } finally {
      menuLoading.value = false
    }
  }

  const fetchMenus = async () => {
    // 直接从路由配置生成菜单，不需要异步请求
    generateMenusFromRouter()
  }

  const getBreadcrumbItems = (path) => {
    const breadcrumbs = []
    breadcrumbs.push({
      title: '首页',
      path: '/dashboard',
      icon: 'House'
    })

    const findPath = (menus, targetPath) => {
      for (const menu of menus) {
        if (menu.fullPath === targetPath) {
          return [menu]
        }
        if (menu.children) {
          const found = findPath(menu.children, targetPath)
          if (found) {
            return [menu, ...found]
          }
        }
      }
      return null
    }

    const pathItems = findPath(menuList.value, path)
    if (pathItems) {
      pathItems.forEach(item => {
        if (item.fullPath !== '/dashboard') {
          breadcrumbs.push({
            title: item.title,
            path: item.fullPath,
            icon: item.icon
          })
        }
      })
    }

    return breadcrumbs
  }

  return {
    menuList,
    menuLoading,
    currentPath,
    fetchMenus,
    getBreadcrumbItems,
    generateMenusFromRouter
  }
})