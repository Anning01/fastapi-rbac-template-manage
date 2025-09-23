import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  // 菜单数据
  const menuList = ref([])
  const menuLoading = ref(false)

  // 默认的静态菜单数据（可以作为fallback）
  const defaultMenus = [
    {
      id: 1,
      title: '仪表盘',
      icon: 'House',
      path: '/dashboard',
      component: 'dashboard',
      meta: {
        title: '仪表盘',
        icon: 'House',
        keepAlive: true
      }
    },
    {
      id: 2,
      title: '用户管理',
      icon: 'User',
      path: '/users',
      children: [
        {
          id: 21,
          title: '用户列表',
          icon: 'UserFilled',
          path: '/users/list',
          component: 'users/UserList',
          meta: {
            title: '用户列表',
            icon: 'UserFilled'
          }
        },
        {
          id: 22,
          title: '角色管理',
          icon: 'Avatar',
          path: '/users/roles',
          component: 'users/RoleList',
          meta: {
            title: '角色管理',
            icon: 'Avatar'
          }
        },
        {
          id: 23,
          title: '权限管理',
          icon: 'Key',
          path: '/users/permissions',
          component: 'users/PermissionList',
          meta: {
            title: '权限管理',
            icon: 'Key'
          }
        }
      ]
    }
  ]

  // 当前路由路径
  const currentPath = ref('')

  // 设置菜单数据
  const setMenuList = (menus) => {
    menuList.value = menus
  }

  // 从API获取菜单数据
  const fetchMenus = async () => {
    menuLoading.value = true
    try {
      // 这里可以调用API获取菜单数据
      // const response = await api.getMenus()
      // setMenuList(response.data)

      // 暂时使用默认菜单数据
      await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API延迟
      setMenuList(defaultMenus)
    } catch (error) {
      console.error('获取菜单失败:', error)
      // 失败时使用默认菜单
      setMenuList(defaultMenus)
    } finally {
      menuLoading.value = false
    }
  }

  // 从JSON设置菜单（用于测试动态菜单）
  const setMenuFromJson = (jsonData) => {
    try {
      const menus = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
      setMenuList(menus)
      return true
    } catch (error) {
      console.error('解析菜单JSON失败:', error)
      return false
    }
  }

  // 重置为默认菜单
  const resetToDefaultMenus = () => {
    setMenuList(defaultMenus)
  }

  // 生成路由配置
  const generateRoutes = computed(() => {
    const routes = []

    const processMenu = (menu, parentPath = '') => {
      if (menu.children && menu.children.length > 0) {
        // 有子菜单，递归处理
        menu.children.forEach(child => processMenu(child, parentPath))
      } else if (menu.path && menu.component) {
        // 叶子节点，生成路由
        // 去掉路径开头的 '/'，因为在子路由中不需要
        const routePath = menu.path.startsWith('/') ? menu.path.substring(1) : menu.path
        routes.push({
          path: routePath,
          name: menu.path.replace(/\//g, '_'),
          component: () => import(`@/views/${menu.component}.vue`).catch(() =>
            import('@/views/NotFound.vue')
          ),
          meta: {
            title: menu.title,
            icon: menu.icon,
            keepAlive: menu.meta?.keepAlive || false,
            requiresAuth: menu.meta?.requiresAuth !== false,
            ...menu.meta
          }
        })
      }
    }

    menuList.value.forEach(menu => processMenu(menu))
    return routes
  })

  // 获取面包屑数据
  const getBreadcrumbItems = (path) => {
    const breadcrumbs = []

    // 添加首页
    breadcrumbs.push({
      title: '首页',
      path: '/dashboard',
      icon: 'House'
    })

    // 递归查找路径
    const findPath = (menus, targetPath, parents = []) => {
      for (const menu of menus) {
        const currentPath = [...parents, menu]

        if (menu.path === targetPath) {
          return currentPath
        }

        if (menu.children && menu.children.length > 0) {
          const found = findPath(menu.children, targetPath, currentPath)
          if (found) return found
        }
      }
      return null
    }

    const pathItems = findPath(menuList.value, path)
    if (pathItems) {
      pathItems.forEach((item, index) => {
        // 跳过首页（已经添加）
        if (item.path !== '/dashboard') {
          breadcrumbs.push({
            title: item.title,
            path: item.path,
            icon: item.icon
          })
        }
      })
    }

    return breadcrumbs
  }

  // 查找菜单项
  const findMenuItem = (path) => {
    const findInMenus = (menus) => {
      for (const menu of menus) {
        if (menu.path === path) {
          return menu
        }
        if (menu.children) {
          const found = findInMenus(menu.children)
          if (found) return found
        }
      }
      return null
    }

    return findInMenus(menuList.value)
  }

  // 获取扁平化的菜单列表
  const flatMenuList = computed(() => {
    const flattened = []

    const flatten = (menus) => {
      menus.forEach(menu => {
        flattened.push(menu)
        if (menu.children && menu.children.length > 0) {
          flatten(menu.children)
        }
      })
    }

    flatten(menuList.value)
    return flattened
  })

  // 检查菜单是否有权限
  const hasPermission = (menu, userPermissions = []) => {
    if (!menu.meta?.permission) return true
    return userPermissions.includes(menu.meta.permission)
  }

  // 过滤有权限的菜单
  const getAuthorizedMenus = (userPermissions = []) => {
    const filterMenus = (menus) => {
      return menus.filter(menu => {
        if (!hasPermission(menu, userPermissions)) {
          return false
        }

        if (menu.children && menu.children.length > 0) {
          menu.children = filterMenus(menu.children)
          return menu.children.length > 0
        }

        return true
      })
    }

    return filterMenus([...menuList.value])
  }

  return {
    // state
    menuList,
    menuLoading,
    currentPath,
    defaultMenus,

    // getters
    generateRoutes,
    flatMenuList,

    // actions
    setMenuList,
    fetchMenus,
    setMenuFromJson,
    resetToDefaultMenus,
    getBreadcrumbItems,
    findMenuItem,
    hasPermission,
    getAuthorizedMenus
  }
})