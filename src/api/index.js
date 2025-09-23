import request from '@/utils/request'

// 认证相关接口
export const authApi = {
  // 登录
  login: (data) => {
    return request.post('/auth/login', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },

  // 刷新 token
  refresh: (refreshToken) => {
    return request.post('/auth/refresh', null, {
      params: { refresh_token: refreshToken }
    })
  }
}

// 用户管理接口
export const userApi = {
  // 获取用户信息
  getUserInfo: () => {
    return request.get('/user/info')
  },

  // 创建用户
  createUser: (data) => {
    return request.post('/user/create', data)
  },

  // 获取用户列表
  getUserList: (params) => {
    return request.get('/user/list', params)
  },

  // 获取用户详情
  getUserDetail: (userId) => {
    return request.get(`/user/${userId}`)
  },

  // 激活用户
  activateUser: (userId) => {
    return request.put(`/user/${userId}/activate`)
  },

  // 禁用用户
  deactivateUser: (userId) => {
    return request.put(`/user/${userId}/deactivate`)
  }
}

// 角色管理接口
export const roleApi = {
  // 创建角色
  createRole: (data) => {
    return request.post('/role/', data)
  },

  // 获取角色列表
  getRoleList: (params) => {
    return request.get('/role/', params)
  },

  // 获取角色详情
  getRoleDetail: (roleId) => {
    return request.get(`/role/${roleId}`)
  },

  // 更新角色
  updateRole: (roleId, data) => {
    return request.put(`/role/${roleId}`, data)
  },

  // 删除角色
  deleteRole: (roleId) => {
    return request.delete(`/role/${roleId}`)
  }
}

// 权限管理接口
export const permissionApi = {
  // 创建权限
  createPermission: (data) => {
    return request.post('/permission/', data)
  },

  // 获取权限列表
  getPermissionList: (params) => {
    return request.get('/permission/', params)
  },

  // 获取权限详情
  getPermissionDetail: (permissionId) => {
    return request.get(`/permission/${permissionId}`)
  },

  // 更新权限
  updatePermission: (permissionId, data) => {
    return request.put(`/permission/${permissionId}`, data)
  },

  // 删除权限
  deletePermission: (permissionId) => {
    return request.delete(`/permission/${permissionId}`)
  }
}

// 用户角色管理接口
export const userRoleApi = {
  // 为用户分配角色
  assignUserRoles: (userId, data) => {
    return request.post(`/user_role/${userId}/roles`, data)
  },

  // 获取用户角色
  getUserRoles: (userId) => {
    return request.get(`/user_role/${userId}/roles`)
  },

  // 移除用户角色
  removeUserRole: (userId, roleId) => {
    return request.delete(`/user_role/${userId}/roles/${roleId}`)
  },

  // 获取用户完整权限信息
  getUserPermissions: (userId) => {
    return request.get(`/user_role/${userId}/permissions`)
  }
}

// 操作日志接口
export const operationLogApi = {
  // 获取操作日志列表
  getOperationLogs: (params) => {
    return request.get('/operation_log/', params)
  },

  // 获取操作日志详情
  getOperationLogDetail: (logId) => {
    return request.get(`/operation_log/${logId}`)
  },

  // 获取指定用户的操作日志
  getUserOperationLogs: (userId, params) => {
    return request.get(`/operation_log/user/${userId}`, params)
  },

  // 获取指定模块的操作日志
  getModuleOperationLogs: (moduleName, params) => {
    return request.get(`/operation_log/module/${moduleName}`, params)
  }
}