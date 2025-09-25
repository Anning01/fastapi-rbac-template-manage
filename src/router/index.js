import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 不需要权限和布局的路由
const publicRoutes = [
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

// 主布局路由（包含所有需要布局的页面）
const layoutRoute = {
  path: '/',
  name: 'Layout',
  component: () => import('@/layouts/AdminLayout.vue'),
  redirect: '/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard.vue'),
      meta: {
        title: '仪表盘',
        icon: 'House',
        requiresAuth: true
      }
    },
    {
      path: 'system',
      name: 'System',
      component: () => import('@/layouts/RouterViewWrapper.vue'),
      redirect: '/system/users',
      meta: {
        title: '系统管理',
        icon: 'Setting',
        requiresAuth: true
      },
      children: [
        {
          path: 'users',
          name: 'Users',
          component: () => import('@/views/users/UserList.vue'),
          meta: {
            title: '用户管理',
            icon: 'User',
            requiresAuth: true
          }
        },
        {
          path: 'roles',
          name: 'Roles',
          component: () => import('@/views/users/RoleList.vue'),
          meta: {
            title: '角色管理',
            icon: 'Avatar',
            requiresAuth: true
          }
        },
        {
          path: 'permissions',
          name: 'Permissions',
          component: () => import('@/views/users/PermissionList.vue'),
          meta: {
            title: '权限管理',
            icon: 'Key',
            requiresAuth: true
          }
        }
      ]
    }
  ]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [layoutRoute, ...publicRoutes]
})

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  const isAuthenticated = authStore.token

  // If the route does not require authentication
  if (to.meta.requiresAuth === false) {
    next()
    return
  }

  // If the user is authenticated
  if (isAuthenticated) {
    next()
  } else {
    // If the user is not authenticated, redirect to login
    next({ path: '/login', query: { redirect: to.fullPath } })
  }
})


// 路由后置守卫
router.afterEach((to) => {
  // 更新页面标题
  const title = to.meta?.title
  if (title) {
    document.title = `${title} - 管理后台`
  }
})

// 从路由配置生成菜单的函数
export const generateMenuFromRoutes = (routes) => {
  const buildMenus = (routeList) => {
    return routeList
      .filter(route => route.meta && !route.meta.hideInMenu && route.meta.requiresAuth)
      .map(route => {
        const menu = {
          id: route.name,
          title: route.meta.title,
          icon: route.meta.icon,
          path: route.path === '' ? '/' : route.path,
          fullPath: route.path === '' ? '/' : route.path
        }

        if (route.children && route.children.length > 0) {
          const children = buildMenus(route.children).map(child => ({
            ...child,
            fullPath: route.path === '/' ? child.path : `/${route.path}/${child.path}`.replace(/\/\/+/g, '/')
          }))
          if (children.length > 0) {
            menu.children = children
          }
        }

        return menu
      })
  }

  const layoutRoute = routes.find(route => route.name === 'Layout')
  return layoutRoute ? buildMenus(layoutRoute.children || []) : []
}

export default router