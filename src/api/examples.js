// 使用示例

import { userApi, roleApi, authApi } from '@/api'
import { tokenUtils } from '@/utils/request'

// 1. 登录示例
const handleLogin = async (loginForm) => {
  try {
    const response = await authApi.login({
      username: loginForm.username,
      password: loginForm.password,
      grant_type: 'password'
    })

    // 保存 token
    tokenUtils.setToken(response.data.access_token)
    tokenUtils.setRefreshToken(response.data.refresh_token)

    console.log('登录成功:', response.data)
  } catch (error) {
    console.error('登录失败:', error.message)
  }
}

// 2. 获取用户列表示例
const fetchUserList = async (queryParams) => {
  try {
    const response = await userApi.getUserList({
      page: queryParams.page || 1,
      page_size: queryParams.pageSize || 10,
      search: queryParams.search,
      sort: queryParams.sort
    })

    console.log('用户列表:', response.data.items)
    console.log('分页信息:', response.data.pagination)
    return response.data
  } catch (error) {
    console.error('获取用户列表失败:', error.message)
  }
}

// 3. 创建角色示例
const createRole = async (roleData) => {
  try {
    const response = await roleApi.createRole({
      name: roleData.name,
      code: roleData.code,
      description: roleData.description,
      is_active: roleData.isActive,
      permission_ids: roleData.permissionIds
    })

    console.log('角色创建成功:', response.data)
    return response.data
  } catch (error) {
    console.error('创建角色失败:', error.message)
  }
}

// 4. 错误处理示例
const handleApiCall = async () => {
  try {
    const response = await userApi.getUserInfo()
    console.log('用户信息:', response.data)
  } catch (error) {
    // 错误已经在 request.js 中统一处理了
    // 这里可以做一些特殊的业务逻辑处理
    console.error('API 调用失败:', error.message)
  }
}

// 5. 分页查询示例
const fetchDataWithPagination = async (params) => {
  try {
    const response = await userApi.getUserList({
      page: params.currentPage,
      page_size: params.pageSize,
      search: params.keyword,
      sort: params.sortField ? `${params.sortOrder === 'desc' ? '-' : ''}${params.sortField}` : undefined
    })

    return {
      list: response.data.items,
      total: response.data.pagination.total,
      page: response.data.pagination.page,
      pageSize: response.data.pagination.page_size
    }
  } catch (error) {
    console.error('获取数据失败:', error.message)
    return {
      list: [],
      total: 0,
      page: 1,
      pageSize: 10
    }
  }
}

// 6. 批量操作示例
const batchOperations = async (userIds, operation) => {
  const promises = userIds.map(userId => {
    switch (operation) {
      case 'activate':
        return userApi.activateUser(userId)
      case 'deactivate':
        return userApi.deactivateUser(userId)
      default:
        return Promise.resolve()
    }
  })

  try {
    const results = await Promise.allSettled(promises)
    const successful = results.filter(result => result.status === 'fulfilled')
    const failed = results.filter(result => result.status === 'rejected')

    console.log(`批量操作完成: 成功 ${successful.length} 个, 失败 ${failed.length} 个`)
    return { successful: successful.length, failed: failed.length }
  } catch (error) {
    console.error('批量操作失败:', error.message)
  }
}

export {
  handleLogin,
  fetchUserList,
  createRole,
  handleApiCall,
  fetchDataWithPagination,
  batchOperations
}