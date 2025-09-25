<template>
  <DataTable
    :config="tableConfig"
    :columns="columns"
    :search-fields="searchFields"
    :form-fields="formFields"
    :api-service="userApi"
    @create="handleCreate"
    @edit="handleEdit"
  >
    <!-- 用户名列自定义渲染 -->
    <template #column-username="{ row }">
      <div class="user-cell">
        <el-avatar
          :size="32"
          :src="row.avatar"
          class="user-avatar"
        >
          {{ (row.username || 'U').charAt(0).toUpperCase() }}
        </el-avatar>
        <div class="user-info">
          <div class="username">{{ row.username || '--' }}</div>
          <div class="nickname">{{ row.nickname || '--' }}</div>
        </div>
      </div>
    </template>

    <!-- 角色列自定义渲染 -->
    <template #column-roles="{ row }">
      <div class="role-tags">
        <el-tag
          v-for="role in row.roles?.slice(0, 2) || []"
          :key="role.id"
          type="primary"
          size="small"
          class="role-tag"
        >
          {{ role.name }}
        </el-tag>
        <el-tag
          v-if="row.roles && row.roles.length > 2"
          size="small"
          type="info"
          class="role-tag"
        >
          +{{ row.roles.length - 2 }}
        </el-tag>
        <span v-if="!row.roles || row.roles.length === 0" class="no-roles">暂无角色</span>
      </div>
    </template>

    <!-- 用户状态列自定义渲染 -->
    <template #column-is_active="{ row }">
      <el-switch
        v-model="row.is_active"
        :loading="row._switching"
        @change="handleStatusChange(row)"
        active-text="启用"
        inactive-text="禁用"
      />
    </template>
  </DataTable>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'
import DataTable from '@/components/DataTable.vue'
import { userApi } from '@/api/rbac.js'

// 表格配置
const tableConfig = {
  title: '用户管理',
  subtitle: '管理系统用户账号和权限',
  icon: User,
  createText: '新建用户'
}

// 列配置
const columns = [
  {
    prop: 'username',
    label: '用户信息',
    minWidth: 200
  },
  {
    prop: 'is_superuser',
    label: '超级用户',
    minWidth: 100,
    type: 'tag',
    tagMap: {
      true: { text: '超管', type: 'danger' },
      false: { text: '普通', type: 'info' }
    }
  },
  {
    prop: 'is_active',
    label: '状态',
    minWidth: 180,
    type: 'status'
  },
  {
    prop: 'roles',
    label: '角色',
    minWidth: 180
  },
  {
    prop: 'last_login',
    label: '最后登录',
    width: 160,
    type: 'date'
  },
  {
    prop: 'created_at',
    label: '创建时间',
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
    placeholder: '用户名/昵称',
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
  },
  {
    prop: 'is_superuser',
    label: '用户类型',
    type: 'select',
    placeholder: '请选择类型',
    options: [
      { label: '普通用户', value: false },
      { label: '超级用户', value: true }
    ]
  }
]

// 表单字段
const formFields = [
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    placeholder: '请输入用户名',
    maxlength: 50,
    help: '用户名用于登录，创建后不可修改'
  },
  {
    prop: 'password',
    label: '密码',
    type: 'password',
    required: true,
    placeholder: '请输入密码',
    minlength: 6,
    maxlength: 50,
    help: '密码长度6-50位，编辑时留空则不修改'
  },
  {
    prop: 'nickname',
    label: '昵称',
    type: 'input',
    placeholder: '请输入用户昵称',
    maxlength: 50,
    help: '用户的显示名称'
  },
  {
    prop: 'is_superuser',
    label: '超级用户',
    type: 'switch',
    activeText: '是',
    inactiveText: '否',
    defaultValue: false,
    help: '超级用户拥有所有权限'
  }
]

// 处理创建
const handleCreate = ({ formData }) => {
}

// 处理编辑
const handleEdit = ({ row, formData }) => {
  // 编辑时不需要密码字段
  if (formData.id) {
    delete formData.password
  }
}

// 处理用户状态切换
const handleStatusChange = async (row) => {
  const originalStatus = !row.is_active
  row._switching = true

  try {
    if (row.is_active) {
      await userApi.activate(row.id)
      ElMessage.success(`用户 ${row.username} 已启用`)
    } else {
      await userApi.deactivate(row.id)
      ElMessage.success(`用户 ${row.username} 已禁用`)
    }
  } catch (error) {
    // 操作失败，恢复状态
    row.is_active = originalStatus
    ElMessage.error(`状态切换失败: ${error.message || error}`)
  } finally {
    row._switching = false
  }
}
</script>

<style scoped>
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.user-info {
  min-width: 0;
  flex: 1;
}

.username {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.nickname {
  color: #6b7280;
  font-size: 12px;
  margin-top: 2px;
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.role-tag {
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
}

.no-roles {
  color: #9ca3af;
  font-size: 12px;
  font-style: italic;
}
</style>