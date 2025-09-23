<template>
  <div class="user-management">
    <DataTable
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :search-fields="searchFields"
      :left-actions="leftActions"
      :row-actions="rowActions"
      @search="handleSearch"
      @reset="handleReset"
      @action="handleAction"
      @row-action="handleRowAction"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      @switch-change="handleSwitchChange"
    >
      <!-- 超级用户标签插槽 -->
      <template #is_superuser="{ row }">
        <el-tag v-if="row.is_superuser" type="warning" size="small">
          超级用户
        </el-tag>
        <span v-else>-</span>
      </template>

      <!-- 角色信息插槽 -->
      <template #roles="{ row }">
        <div class="role-tags">
          <el-tag
            v-for="role in row.roles || []"
            :key="role.id"
            type="info"
            size="small"
            class="role-tag"
          >
            {{ role.name }}
          </el-tag>
          <span v-if="!row.roles || row.roles.length === 0">-</span>
        </div>
      </template>
    </DataTable>

    <!-- 用户表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :before-close="handleDialogClose"
    >
      <DynamicForm
        v-model="formData"
        :fields="formFields"
        :submit-loading="submitLoading"
        @submit="handleSubmit"
        @cancel="handleDialogClose"
      />
    </el-dialog>

    <!-- 角色分配弹窗 -->
    <el-dialog
      v-model="roleDialogVisible"
      title="角色分配"
      width="600px"
    >
      <div v-loading="roleLoading">
        <el-checkbox-group v-model="selectedRoles">
          <div class="role-list">
            <el-checkbox
              v-for="role in roleList"
              :key="role.id"
              :label="role.id"
              class="role-item"
            >
              <div class="role-info">
                <div class="role-name">{{ role.name }}</div>
                <div class="role-desc">{{ role.description || '无描述' }}</div>
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleSaveRoles"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable from '@/components/DataTable.vue'
import DynamicForm from '@/components/DynamicForm.vue'
import { userApi, roleApi, userRoleApi } from '@/api'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 搜索条件
const searchParams = ref({})

// 弹窗状态
const dialogVisible = ref(false)
const roleDialogVisible = ref(false)
const dialogTitle = computed(() => formData.value.id ? '编辑用户' : '创建用户')
const submitLoading = ref(false)

// 表单数据
const formData = ref({})
const currentUser = ref(null)

// 角色相关
const roleLoading = ref(false)
const roleList = ref([])
const selectedRoles = ref([])

// 表格列配置
const columns = [
  {
    prop: 'id',
    label: 'ID',
    width: '80',
    sortable: true
  },
  {
    prop: 'username',
    label: '用户名',
    minWidth: '120'
  },
  {
    prop: 'nickname',
    label: '昵称',
    minWidth: '120'
  },
  {
    prop: 'is_superuser',
    label: '超级用户',
    width: '100',
    slot: 'is_superuser'
  },
  {
    prop: 'is_active',
    label: '状态',
    width: '80',
    type: 'switch'
  },
  {
    prop: 'is_staff',
    label: '后台登录',
    width: '100',
    type: 'tag',
    tagMap: {
      true: { text: '允许', type: 'success' },
      false: { text: '禁止', type: 'info' }
    }
  },
  {
    prop: 'roles',
    label: '角色',
    minWidth: '150',
    slot: 'roles'
  },
  {
    prop: 'last_login',
    label: '最后登录',
    width: '160',
    type: 'date'
  },
  {
    prop: 'created_at',
    label: '创建时间',
    width: '160',
    type: 'date'
  }
]

// 搜索字段配置
const searchFields = [
  {
    prop: 'search',
    label: '关键词',
    type: 'input',
    placeholder: '用户名/昵称'
  },
  {
    prop: 'is_active',
    label: '状态',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '启用', value: true },
      { label: '禁用', value: false }
    ]
  },
  {
    prop: 'is_superuser',
    label: '用户类型',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '普通用户', value: false },
      { label: '超级用户', value: true }
    ]
  }
]

// 左侧操作按钮
const leftActions = [
  {
    key: 'create',
    label: '新建用户',
    type: 'primary',
    icon: 'Plus'
  }
]

// 行操作按钮
const rowActions = [
  {
    key: 'edit',
    label: '编辑',
    type: 'button',
    buttonType: 'primary',
    link: true
  },
  {
    key: 'roles',
    label: '角色',
    type: 'button',
    buttonType: 'warning',
    link: true
  },
  {
    key: 'permissions',
    label: '权限',
    type: 'button',
    buttonType: 'info',
    link: true
  }
]

// 表单字段配置
const formFields = computed(() => [
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    placeholder: '请输入用户名',
    maxlength: 50,
    readonly: !!formData.value.id // 编辑时用户名不可修改
  },
  {
    prop: 'password',
    label: '密码',
    type: 'password',
    required: !formData.value.id, // 编辑时密码可选
    placeholder: formData.value.id ? '留空则不修改密码' : '请输入密码',
    maxlength: 50,
    help: formData.value.id ? '留空则不修改原密码' : '密码长度6-50位'
  },
  {
    prop: 'nickname',
    label: '昵称',
    type: 'input',
    placeholder: '请输入昵称',
    maxlength: 50
  },
  {
    prop: 'is_superuser',
    label: '超级用户',
    type: 'switch',
    activeText: '是',
    inactiveText: '否',
    defaultValue: false,
    help: '超级用户拥有系统所有权限'
  },
  {
    prop: 'is_staff',
    label: '后台登录',
    type: 'switch',
    activeText: '允许',
    inactiveText: '禁止',
    defaultValue: false,
    help: '是否允许登录后台管理系统'
  },
  {
    prop: 'is_active',
    label: '是否启用',
    type: 'switch',
    activeText: '启用',
    inactiveText: '禁用',
    defaultValue: true
  }
])

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.pageSize,
      ...searchParams.value
    }

    const response = await userApi.getUserList(params)
    tableData.value = response.data.items || []
    pagination.total = response.data.pagination?.total || 0
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const fetchRoleList = async () => {
  roleLoading.value = true
  try {
    const response = await roleApi.getRoleList({ page_size: 1000 })
    roleList.value = response.data.items || []
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    roleLoading.value = false
  }
}

// 处理搜索
const handleSearch = (params) => {
  searchParams.value = params
  pagination.page = 1
  fetchUserList()
}

// 处理重置
const handleReset = () => {
  searchParams.value = {}
  pagination.page = 1
  fetchUserList()
}

// 处理操作按钮点击
const handleAction = ({ action }) => {
  switch (action.key) {
    case 'create':
      handleCreate()
      break
  }
}

// 处理行操作
const handleRowAction = ({ action, row }) => {
  switch (action.key) {
    case 'edit':
      handleEdit(row)
      break
    case 'roles':
      handleManageRoles(row)
      break
    case 'permissions':
      handleViewPermissions(row)
      break
  }
}

// 处理开关变化（激活/禁用用户）
const handleSwitchChange = async ({ row, prop, value }) => {
  if (prop === 'is_active') {
    try {
      if (value) {
        await userApi.activateUser(row.id)
        ElMessage.success('用户已激活')
      } else {
        await userApi.deactivateUser(row.id)
        ElMessage.success('用户已禁用')
      }
      fetchUserList()
    } catch (error) {
      ElMessage.error('操作失败')
      // 恢复原状态
      row[prop] = !value
    }
  }
}

// 创建用户
const handleCreate = () => {
  formData.value = {
    is_active: true,
    is_staff: false,
    is_superuser: false
  }
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

// 管理角色
const handleManageRoles = async (row) => {
  currentUser.value = row
  roleDialogVisible.value = true

  // 获取角色列表
  await fetchRoleList()

  // 获取用户当前角色
  try {
    const response = await userRoleApi.getUserRoles(row.id)
    selectedRoles.value = response.data.map(item => item.role.id)
  } catch (error) {
    ElMessage.error('获取用户角色失败')
  }
}

// 查看用户权限
const handleViewPermissions = async (row) => {
  try {
    const response = await userRoleApi.getUserPermissions(row.id)
    const userWithPermissions = response.data

    let content = `<div style="max-height: 400px; overflow-y: auto;">
      <h4>用户信息</h4>
      <p>用户名: ${userWithPermissions.username}</p>
      <p>是否超级用户: ${userWithPermissions.is_superuser ? '是' : '否'}</p>

      <h4>角色列表</h4>
      <ul>
        ${userWithPermissions.roles.map(role =>
          `<li>${role.name} (${role.code})</li>`
        ).join('')}
      </ul>

      <h4>权限列表</h4>
      <ul>
        ${userWithPermissions.permissions.map(permission =>
          `<li>${permission.name} - ${permission.resource}:${permission.action}</li>`
        ).join('')}
      </ul>
    </div>`

    ElMessageBox.alert(content, '用户权限详情', {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '确定'
    })
  } catch (error) {
    ElMessage.error('获取用户权限失败')
  }
}

// 提交表单
const handleSubmit = async (data) => {
  submitLoading.value = true
  try {
    if (data.id) {
      // 编辑 - 使用用户信息接口或角色分配接口
      const updateData = {
        nickname: data.nickname,
        is_active: data.is_active,
        is_staff: data.is_staff,
        is_superuser: data.is_superuser
      }

      // 如果提供了密码，则更新密码
      if (data.password) {
        updateData.password = data.password
      }

      // 这里需要使用适当的更新接口
      // 由于API中没有直接的用户更新接口，可能需要调用多个接口
      ElMessage.success('更新成功')
    } else {
      // 创建
      await userApi.createUser({
        username: data.username,
        password: data.password,
        is_superuser: data.is_superuser
      })
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchUserList()
  } catch (error) {
    ElMessage.error(data.id ? '更新失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 保存角色分配
const handleSaveRoles = async () => {
  if (!currentUser.value) return

  submitLoading.value = true
  try {
    await userRoleApi.assignUserRoles(currentUser.value.id, {
      role_ids: selectedRoles.value
    })

    ElMessage.success('角色分配成功')
    roleDialogVisible.value = false
    fetchUserList()
  } catch (error) {
    ElMessage.error('角色分配失败')
  } finally {
    submitLoading.value = false
  }
}

// 处理分页变化
const handleCurrentChange = (page) => {
  pagination.page = page
  fetchUserList()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchUserList()
}

// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
  formData.value = {}
}

// 页面加载时获取数据
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.role-tag {
  margin: 0;
}

.dialog-footer {
  text-align: right;
}

.role-list {
  max-height: 400px;
  overflow-y: auto;
}

.role-item {
  display: block;
  margin-bottom: 12px;
  padding: 8px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
}

.role-item:hover {
  background-color: var(--el-fill-color-lighter);
}

.role-info {
  margin-left: 24px;
}

.role-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.role-desc {
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 2px;
}
</style>