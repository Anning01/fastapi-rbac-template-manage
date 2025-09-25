<template>
  <DataTable
    :config="tableConfig"
    :columns="columns"
    :search-fields="searchFields"
    :form-fields="formFields"
    :api-service="permissionApi"
    @create="handleCreate"
    @edit="handleEdit"
  >
    <!-- 权限名称列自定义渲染 -->
    <template #column-name="{ row }">
      <div class="name-cell">
        <el-icon class="permission-icon"><Key /></el-icon>
        <span class="permission-name">{{ row.name }}</span>
      </div>
    </template>

    <!-- 权限代码列自定义渲染 -->
    <template #column-code="{ row }">
      <el-tag type="info" class="code-tag">{{ row.code }}</el-tag>
    </template>

    <!-- 资源列自定义渲染 -->
    <template #column-resource="{ row }">
      <el-tag :type="getResourceTagType(row.resource)" class="resource-tag">
        {{ getResourceLabel(row.resource) }}
      </el-tag>
    </template>

    <!-- 操作列自定义渲染 -->
    <template #column-action="{ row }">
      <el-tag :type="getActionTagType(row.action)" class="action-tag">
        {{ getActionLabel(row.action) }}
      </el-tag>
    </template>
  </DataTable>
</template>

<script setup>
import { Key } from '@element-plus/icons-vue'
import DataTable from '@/components/DataTable.vue'
import { permissionApi } from '@/api/rbac.js'

// 表格配置
const tableConfig = {
  title: '权限管理',
  subtitle: '管理系统权限，控制用户访问资源',
  icon: Key,
  createText: '新建权限'
}

// 列配置
const columns = [
  {
    prop: 'name',
    label: '权限名称',
    minWidth: 150
  },
  {
    prop: 'code',
    label: '权限代码',
    minWidth: 150
  },
  {
    prop: 'resource',
    label: '资源',
    width: 120
  },
  {
    prop: 'action',
    label: '操作',
    width: 100
  },
  {
    prop: 'description',
    label: '描述',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'created_at',
    label: '创建时间',
    width: 160,
    type: 'date'
  }
]

// 资源选项
const resourceOptions = [
  { label: '用户管理', value: 'user' },
  { label: '角色管理', value: 'role' },
  { label: '权限管理', value: 'permission' },
  { label: '菜单管理', value: 'menu' },
  { label: '系统设置', value: 'system' },
  { label: '操作日志', value: 'operation_log' },
  { label: '数据统计', value: 'analytics' }
]

// 操作选项
const actionOptions = [
  { label: '查看', value: 'read' },
  { label: '创建', value: 'create' },
  { label: '更新', value: 'update' },
  { label: '删除', value: 'delete' },
  { label: '导入', value: 'import' },
  { label: '导出', value: 'export' },
  { label: '审核', value: 'approve' },
  { label: '管理', value: 'manage' }
]

// 搜索字段
const searchFields = [
  {
    prop: 'search',
    label: '关键词',
    type: 'input',
    placeholder: '权限名称/代码/描述',
    prefixIcon: 'Search'
  },
  {
    prop: 'resource',
    label: '资源',
    type: 'select',
    placeholder: '请选择资源',
    options: resourceOptions
  },
  {
    prop: 'action',
    label: '操作',
    type: 'select',
    placeholder: '请选择操作',
    options: actionOptions
  }
]

// 表单字段
const formFields = [
  {
    prop: 'name',
    label: '权限名称',
    type: 'input',
    required: true,
    placeholder: '请输入权限名称',
    maxlength: 100,
    help: '权限的显示名称，如：查看用户列表'
  },
  {
    prop: 'code',
    label: '权限代码',
    type: 'input',
    required: true,
    placeholder: '请输入权限代码',
    maxlength: 100,
    help: '权限的唯一标识，如：user:read，格式：资源:操作'
  },
  {
    prop: 'resource',
    label: '资源',
    type: 'select',
    required: true,
    placeholder: '请选择资源',
    options: resourceOptions,
    help: '该权限作用的资源类型'
  },
  {
    prop: 'action',
    label: '操作',
    type: 'select',
    required: true,
    placeholder: '请选择操作',
    options: actionOptions,
    help: '对资源执行的操作类型'
  },
  {
    prop: 'description',
    label: '描述',
    type: 'textarea',
    placeholder: '请输入权限描述',
    maxlength: 500,
    rows: 3,
    help: '权限的详细说明'
  }
]

// 工具方法
const getResourceLabel = (resource) => {
  return resourceOptions.find(item => item.value === resource)?.label || resource
}

const getActionLabel = (action) => {
  return actionOptions.find(item => item.value === action)?.label || action
}

const getResourceTagType = (resource) => {
  const typeMap = {
    'user': 'primary',
    'role': 'success',
    'permission': 'warning',
    'menu': 'info',
    'system': 'danger',
    'operation_log': 'warning',
    'analytics': 'success'
  }
  return typeMap[resource] || ''
}

const getActionTagType = (action) => {
  const typeMap = {
    'read': 'info',
    'create': 'success',
    'update': 'primary',
    'delete': 'danger',
    'import': 'warning',
    'export': 'warning',
    'approve': 'success',
    'manage': 'primary'
  }
  return typeMap[action] || ''
}

// 处理创建
const handleCreate = ({ formData }) => {
  // 如果没有手动输入代码，自动生成
  if (!formData.code && formData.resource && formData.action) {
    formData.code = `${formData.resource}:${formData.action}`
  }
}

// 处理编辑
const handleEdit = ({ formData }) => {
  // 编辑时代码字段只读
  // 这里可以添加其他编辑相关的逻辑
}
</script>

<style scoped>
.name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.permission-icon {
  color: #667eea;
  font-size: 18px;
}

.permission-name {
  font-weight: 600;
  color: #374151;
}

.code-tag {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
}

.resource-tag, .action-tag {
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 12px;
  border: none;
}
</style>