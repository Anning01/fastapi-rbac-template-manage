<template>
  <div class="permission-management">
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
    />

    <!-- 权限表单弹窗 -->
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable from '@/components/DataTable.vue'
import DynamicForm from '@/components/DynamicForm.vue'
import { permissionApi } from '@/api'

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
const dialogTitle = computed(() => formData.value.id ? '编辑权限' : '创建权限')
const submitLoading = ref(false)

// 表单数据
const formData = ref({})

// 资源选项（可以根据实际需求动态获取）
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
    label: '权限名称',
    minWidth: '150'
  },
  {
    prop: 'code',
    label: '权限代码',
    minWidth: '150'
  },
  {
    prop: 'resource',
    label: '资源',
    width: '120'
  },
  {
    prop: 'action',
    label: '操作',
    width: '100'
  },
  {
    prop: 'description',
    label: '描述',
    minWidth: '200',
    showOverflowTooltip: true
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
    placeholder: '权限名称/代码/描述'
  },
  {
    prop: 'resource',
    label: '资源',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      ...resourceOptions
    ]
  },
  {
    prop: 'action',
    label: '操作',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      ...actionOptions
    ]
  }
]

// 左侧操作按钮
const leftActions = [
  {
    key: 'create',
    label: '新建权限',
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
    key: 'delete',
    label: '删除',
    type: 'button',
    buttonType: 'danger',
    link: true
  }
]

// 表单字段配置
const formFields = computed(() => [
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
    readonly: !!formData.value.id, // 编辑时代码不可修改
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
])

// 获取权限列表
const fetchPermissionList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.pageSize,
      ...searchParams.value
    }

    const response = await permissionApi.getPermissionList(params)
    tableData.value = response.data.items || []
    pagination.total = response.data.pagination?.total || 0
  } catch (error) {
    ElMessage.error('获取权限列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (params) => {
  searchParams.value = params
  pagination.page = 1
  fetchPermissionList()
}

// 处理重置
const handleReset = () => {
  searchParams.value = {}
  pagination.page = 1
  fetchPermissionList()
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
    case 'delete':
      handleDelete(row)
      break
  }
}

// 创建权限
const handleCreate = () => {
  formData.value = {}
  dialogVisible.value = true
}

// 编辑权限
const handleEdit = (row) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

// 删除权限
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除权限"${row.name}"吗？删除后相关角色的权限配置也会受到影响。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await permissionApi.deletePermission(row.id)
    ElMessage.success('删除成功')
    fetchPermissionList()
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
    // 如果没有手动输入代码，自动生成
    if (!data.code && data.resource && data.action) {
      data.code = `${data.resource}:${data.action}`
    }

    if (data.id) {
      // 编辑
      await permissionApi.updatePermission(data.id, {
        name: data.name,
        description: data.description
      })
      ElMessage.success('更新成功')
    } else {
      // 创建
      await permissionApi.createPermission({
        name: data.name,
        code: data.code,
        description: data.description,
        resource: data.resource,
        action: data.action
      })
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchPermissionList()
  } catch (error) {
    ElMessage.error(data.id ? '更新失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 处理分页变化
const handleCurrentChange = (page) => {
  pagination.page = page
  fetchPermissionList()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchPermissionList()
}

// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
  formData.value = {}
}

// 页面加载时获取数据
onMounted(() => {
  fetchPermissionList()
})
</script>

<style scoped>
.permission-management {
  padding: 20px;
}
</style>