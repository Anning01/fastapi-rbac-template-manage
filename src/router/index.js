import { createRouter, createWebHistory } from 'vue-router'
import { useMenuStore } from '@/stores/menu'

// 基础路由（不需要权限的路由）
const baseRoutes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
 {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import("@/views/dashboard.vue"),
    meta: {
        title: '仪表盘',
        hideInMenu: false,
        requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
      requiresAuth: false
    }
  },
  {
    path: '/redirect/:path(.*)',
    name: 'Redirect',
    component: () => import('@/views/Redirect.vue'),
    meta: {
      hideInMenu: true,
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404',
      hideInMenu: true,
      requiresAuth: false
    }
  }
]

// 主布局路由
const layoutRoute = {
  path: '/',
  name: 'Layout',
  component: () => import('@/layouts/AdminLayout.vue'),
  children: [] // 动态菜单路由将被添加到这里
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes]
})

// 动态添加路由的函数
export const addDynamicRoutes = (menuRoutes) => {
  // 清除之前的动态路由（如果有的话）
  if (router.hasRoute('Layout')) {
    router.removeRoute('Layout')
  }

  // 创建新的布局路由并添加子路由
  const newLayoutRoute = {
    ...layoutRoute,
    children: menuRoutes
  }

  router.addRoute(newLayoutRoute)
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const menuStore = useMenuStore()

  // 如果是不需要权限的路由，直接通过
  if (to.meta?.requiresAuth === false) {
    next()
    return
  }

  // 检查是否已加载菜单
  if (menuStore.menuList.length === 0 && !menuStore.menuLoading) {
    try {
      // 加载菜单并生成路由
      await menuStore.fetchMenus()
      const dynamicRoutes = menuStore.generateRoutes
      addDynamicRoutes(dynamicRoutes)

      // 重新导航到目标路由
      next({ ...to, replace: true })
    } catch (error) {
      console.error('加载菜单失败:', error)
      next('/login')
    }
  } else {
    next()
  }
})

// 路由后置守卫
router.afterEach((to) => {
  // 更新页面标题
  const title = to.meta?.title
  if (title) {
    document.title = `${title} - 管理后台`
  }

  // 记录当前路径
  const menuStore = useMenuStore()
  menuStore.currentPath = to.path
})

export default router
