import request from '@/utils/request'

export const userApi = {
  // 获取用户列表
  getList: async (params) => {
    return request.get('/user/list', params)
  },

  // 获取用户详情
  getById: async (id) => {
    return request.get(`/user/${id}`)
  },

  // 创建用户
  create: async (data) => {
    return request.post('/user/create', data)
  },

  // 激活用户
  activate: async (id) => {
    return request.put(`/user/${id}/activate`)
  },

  // 禁用用户
  deactivate: async (id) => {
    return request.put(`/user/${id}/deactivate`)
  }
}

export const roleApi = {
  // 获取角色列表
  getList: async (params) => {
    return request.get('/role/', params)
  },

  // 获取角色详情
  getById: async (id) => {
    return request.get(`/role/${id}`)
  },

  // 创建角色
  create: async (data) => {
    return request.post('/role/', data)
  },

  // 更新角色
  update: async (id, data) => {
    return request.put(`/role/${id}`, data)
  },

  // 删除角色
  delete: async (id) => {
    return request.delete(`/role/${id}`)
  }
}

export const permissionApi = {
  // 获取权限列表
  getList: async (params) => {
    return request.get('/permission/', params)
  },

  // 获取权限详情
  getById: async (id) => {
    return request.get(`/permission/${id}`)
  },

  // 创建权限
  create: async (data) => {
    return request.post('/permission/', data)
  },

  // 更新权限
  update: async (id, data) => {
    return request.put(`/permission/${id}`, data)
  },

  // 删除权限
  delete: async (id) => {
    return request.delete(`/permission/${id}`)
  }
}

// 用户角色管理 API
export const userRoleApi = {
  // 获取用户角色
  getUserRoles: async (userId) => {
    return request.get(`/user_role/${userId}/roles`)
  },

  // 为用户分配角色
  assignRoles: async (userId, roleIds) => {
    return request.post(`/user_role/${userId}/roles`, { role_ids: roleIds })
  },

  // 移除用户角色
  removeRole: async (userId, roleId) => {
    return request.delete(`/user_role/${userId}/roles/${roleId}`)
  },

  // 获取用户完整权限信息
  getUserPermissions: async (userId) => {
    return request.get(`/user_role/${userId}/permissions`)
  }
}

// 操作日志 API
export const operationLogApi = {
  // 获取操作日志列表
  getList: async (params) => {
    return request.get('/operation_log/', params)
  },

  // 获取操作日志详情
  getById: async (id) => {
    return request.get(`/operation_log/${id}`)
  },

  // 获取指定用户的操作日志
  getUserLogs: async (userId, params) => {
    return request.get(`/operation_log/user/${userId}`, params)
  },

  // 获取指定模块的操作日志
  getModuleLogs: async (moduleName, params) => {
    return request.get(`/operation_log/module/${moduleName}`, params)
  }
}