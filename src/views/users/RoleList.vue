<template>
  <DataTable
    :config="tableConfig"
    :columns="columns"
    :search-fields="searchFields"
    :form-fields="formFields"
    :api-service="roleApi"
    @create="handleCreate"
    @edit="handleEdit"
  >
    <!-- 角色名称列自定义渲染 -->
    <template #column-name="{ row }">
      <div class="role-cell">
        <div class="role-icon">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="role-info">
          <div class="role-name">{{ row.name }}</div>
          <div class="role-code">{{ row.code }}</div>
        </div>
      </div>
    </template>

    <!-- 权限数量列自定义渲染 -->
    <template #column-permissions="{ row }">
      <div class="permission-count">
        <el-tag
          type="primary"
          size="small"
          class="permission-tag"
          @click="handleViewPermissions(row)"
        >
          <el-icon><Lock /></el-icon>
          {{ row.permissions?.length || 0 }} 个权限
        </el-tag>
      </div>
    </template>
  </DataTable>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled, Lock, Tools } from '@element-plus/icons-vue'
import DataTable from '@/components/DataTable.vue'
import { roleApi, permissionApi } from '@/api/rbac.js'

// 表格配置
const tableConfig = {
  title: '角色管理',
  subtitle: '管理系统角色和权限分配',
  icon: Tools,
  createText: '新建角色'
}

// 列配置
const columns = [
  {
    prop: 'name',
    label: '角色信息',
    minWidth: 200
  },
  {
    prop: 'description',
    label: '描述',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'is_active',
    label: '状态',
    width: 80,
    type: 'status'
  },
  {
    prop: 'permissions',
    label: '权限',
    width: 120
  },
  {
    prop: 'created_at',
    label: '创建时间',
    width: 160,
    type: 'date'
  },
  {
    prop: 'updated_at',
    label: '更新时间',
    width: 160,
    type: 'date'
  }
]

// 搜索字段
const searchFields = [
  {
    prop: 'search',
    label: '关键词',
    type: 'input',
    placeholder: '角色名称/代码/描述',
    prefixIcon: 'Search'
  },
  {
    prop: 'is_active',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '启用', value: true },
      { label: '禁用', value: false }
    ]
  }
]

// 表单字段
const formFields = [
  {
    prop: 'name',
    label: '角色名称',
    type: 'input',
    required: true,
    placeholder: '请输入角色名称',
    maxlength: 50,
    help: '角色的显示名称'
  },
  {
    prop: 'code',
    label: '角色代码',
    type: 'input',
    required: true,
    placeholder: '请输入角色代码',
    maxlength: 50,
    help: '角色的唯一标识，用于权限控制，创建后不可修改'
  },
  {
    prop: 'description',
    label: '角色描述',
    type: 'textarea',
    placeholder: '请输入角色描述',
    maxlength: 200,
    rows: 3,
    help: '角色的详细说明'
  },
  {
    prop: 'is_active',
    label: '启用状态',
    type: 'switch',
    activeText: '启用',
    inactiveText: '禁用',
    defaultValue: true,
    help: '禁用后该角色的用户将失去相应权限'
  },
  {
    prop: 'permission_ids',
    label: '角色权限',
    type: 'select',
    multiple: true,
    placeholder: '请选择角色权限',
    options: [],
    help: '为角色分配权限'
  }
]

// 查看权限详情
const handleViewPermissions = (row) => {
  const permissions = row.permissions || []
  const content = permissions.length > 0
    ? permissions.map(p => `• ${p.name} (${p.resource}:${p.action})`).join('<br>')
    : '该角色暂未分配权限'

  ElMessageBox.alert(content, `角色权限 - ${row.name}`, {
    dangerouslyUseHTMLString: true,
    customClass: 'permission-dialog'
  })
}

// 处理创建
const handleCreate = async ({ formData }) => {
  // 加载权限列表用于选择
  await loadPermissions()
}

// 处理编辑
const handleEdit = async ({ row, formData }) => {
  // 加载权限列表用于选择
  await loadPermissions()

  // 设置当前角色的权限
  if (row.permissions && row.permissions.length > 0) {
    formData.permission_ids = row.permissions.map(p => p.id)
  }
}

// 加载权限列表
const loadPermissions = async () => {
  try {
    const response = await permissionApi.getList({ page: 1, page_size: 100 })
    const permissions = response.data.items || []

    // 更新表单字段中的权限选项
    const permissionField = formFields.find(field => field.prop === 'permission_ids')
    if (permissionField) {
      permissionField.options = permissions.map(p => ({
        label: `${p.name} (${p.resource}:${p.action})`,
        value: p.id
      }))
    }
  } catch (error) {
    ElMessage.error('加载权限列表失败')
  }
}
</script>

<style scoped>
.role-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.role-info {
  min-width: 0;
  flex: 1;
}

.role-name {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.role-code {
  color: #6b7280;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
  display: inline-block;
}

.permission-count {
  cursor: pointer;
}

.permission-tag {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.permission-tag:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>