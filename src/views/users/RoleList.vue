<template>
  <div class="role-management">
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
    >
      <!-- 权限数量插槽 -->
      <template #permissions="{ row }">
        <el-tag type="info" size="small">
          {{ row.permissions?.length || 0 }} 个权限
        </el-tag>
      </template>
    </DataTable>

    <!-- 角色表单弹窗 -->
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

    <!-- 权限分配弹窗 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限分配"
      width="800px"
    >
      <div v-loading="permissionLoading">
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTreeData"
          :props="treeProps"
          :default-checked-keys="checkedPermissions"
          show-checkbox
          node-key="id"
          :check-strictly="false"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleSavePermissions"
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
import { roleApi, permissionApi } from '@/api'

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
const permissionDialogVisible = ref(false)
const dialogTitle = computed(() => formData.value.id ? '编辑角色' : '创建角色')
const submitLoading = ref(false)

// 表单数据
const formData = ref({})
const currentRole = ref(null)

// 权限相关
const permissionLoading = ref(false)
const permissionTreeRef = ref()
const permissionTreeData = ref([])
const checkedPermissions = ref([])

// 表格列配置
const columns = [
  {
    prop: 'id',
    label: 'ID',
    width: '80',
    sortable: true
  },
  {
    prop: 'name',
    label: '角色名称',
    minWidth: '120'
  },
  {
    prop: 'code',
    label: '角色代码',
    minWidth: '120'
  },
  {
    prop: 'description',
    label: '角色描述',
    minWidth: '150',
    showOverflowTooltip: true
  },
  {
    prop: 'is_active',
    label: '状态',
    width: '100',
    type: 'tag',
    tagMap: {
      true: { text: '启用', type: 'success' },
      false: { text: '禁用', type: 'danger' }
    }
  },
  {
    prop: 'permissions',
    label: '权限数量',
    width: '100',
    slot: 'permissions'
  },
  {
    prop: 'created_at',
    label: '创建时间',
    width: '160',
    type: 'date'
  },
  {
    prop: 'updated_at',
    label: '更新时间',
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
    placeholder: '角色名称/代码/描述'
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
  }
]

// 左侧操作按钮
const leftActions = [
  {
    key: 'create',
    label: '新建角色',
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
    key: 'permissions',
    label: '权限',
    type: 'button',
    buttonType: 'warning',
    link: true
  },
  {
    key: 'delete',
    label: '删除',
    type: 'button',
    buttonType: 'danger',
    link: true,
    show: (row) => !row.is_system // 系统角色不能删除
  }
]

// 表单字段配置
const formFields = computed(() => [
  {
    prop: 'name',
    label: '角色名称',
    type: 'input',
    required: true,
    placeholder: '请输入角色名称',
    maxlength: 50
  },
  {
    prop: 'code',
    label: '角色代码',
    type: 'input',
    required: true,
    placeholder: '请输入角色代码（英文）',
    maxlength: 50,
    readonly: !!formData.value.id // 编辑时代码不可修改
  },
  {
    prop: 'description',
    label: '角色描述',
    type: 'textarea',
    placeholder: '请输入角色描述',
    maxlength: 200,
    rows: 3
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

// 权限树配置
const treeProps = {
  children: 'children',
  label: 'name'
}

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.pageSize,
      ...searchParams.value
    }

    const response = await roleApi.getRoleList(params)
    tableData.value = response.data.items || []
    pagination.total = response.data.pagination?.total || 0
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 获取权限列表（树形结构）
const fetchPermissionTree = async () => {
  permissionLoading.value = true
  try {
    const response = await permissionApi.getPermissionList({ page_size: 1000 })
    const permissions = response.data.items || []

    // 转换为树形结构（根据资源分组）
    const resourceMap = new Map()
    permissions.forEach(permission => {
      const resource = permission.resource
      if (!resourceMap.has(resource)) {
        resourceMap.set(resource, {
          id: `resource_${resource}`,
          name: resource,
          children: []
        })
      }
      resourceMap.get(resource).children.push({
        id: permission.id,
        name: `${permission.name} (${permission.action})`,
        resource: permission.resource,
        action: permission.action
      })
    })

    permissionTreeData.value = Array.from(resourceMap.values())
  } catch (error) {
    ElMessage.error('获取权限列表失败')
  } finally {
    permissionLoading.value = false
  }
}

// 处理搜索
const handleSearch = (params) => {
  searchParams.value = params
  pagination.page = 1
  fetchRoleList()
}

// 处理重置
const handleReset = () => {
  searchParams.value = {}
  pagination.page = 1
  fetchRoleList()
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
    case 'permissions':
      handleManagePermissions(row)
      break
    case 'delete':
      handleDelete(row)
      break
  }
}

// 创建角色
const handleCreate = () => {
  formData.value = {
    is_active: true
  }
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (row) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

// 管理权限
const handleManagePermissions = async (row) => {
  currentRole.value = row
  permissionDialogVisible.value = true

  // 获取权限树
  await fetchPermissionTree()

  // 设置已选中的权限
  checkedPermissions.value = row.permissions?.map(p => p.id) || []
}

// 删除角色
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await roleApi.deleteRole(row.id)
    ElMessage.success('删除成功')
    fetchRoleList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async (data) => {
  submitLoading.value = true
  try {
    if (data.id) {
      // 编辑
      await roleApi.updateRole(data.id, {
        name: data.name,
        description: data.description,
        is_active: data.is_active
      })
      ElMessage.success('更新成功')
    } else {
      // 创建
      await roleApi.createRole({
        name: data.name,
        code: data.code,
        description: data.description,
        is_active: data.is_active
      })
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchRoleList()
  } catch (error) {
    ElMessage.error(data.id ? '更新失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 保存权限分配
const handleSavePermissions = async () => {
  if (!currentRole.value) return

  submitLoading.value = true
  try {
    const checkedNodes = permissionTreeRef.value.getCheckedNodes()
    const permissionIds = checkedNodes
      .filter(node => typeof node.id === 'number') // 过滤掉资源分组节点
      .map(node => node.id)

    await roleApi.updateRole(currentRole.value.id, {
      permission_ids: permissionIds
    })

    ElMessage.success('权限分配成功')
    permissionDialogVisible.value = false
    fetchRoleList()
  } catch (error) {
    ElMessage.error('权限分配失败')
  } finally {
    submitLoading.value = false
  }
}

// 处理分页变化
const handleCurrentChange = (page) => {
  pagination.page = page
  fetchRoleList()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchRoleList()
}

// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
  formData.value = {}
}

// 页面加载时获取数据
onMounted(() => {
  fetchRoleList()
})
</script>

<style scoped>
.role-management {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}

:deep(.el-tree) {
  max-height: 400px;
  overflow-y: auto;
}
</style>