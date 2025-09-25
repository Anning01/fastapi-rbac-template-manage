<template>
  <div class="data-table-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon class="title-icon">
              <component :is="config.icon" />
            </el-icon>
            {{ config.title }}
          </h1>
          <p class="page-subtitle">{{ config.subtitle }}</p>
        </div>
        <div class="header-actions">
          <el-button
            type="primary"
            class="create-btn"
            @click="handleCreate"
          >
            <el-icon><Plus /></el-icon>
            {{ config.createText || '新建' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索筛选 -->
    <SearchFilters
      v-if="searchFields.length > 0"
      v-model="searchParams"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <div class="table-card">
      <div class="table-header">
        <div class="table-info">
          <span class="total-count">共 {{ pagination.total }} 条记录</span>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        class="modern-table"
        :stripe="true"
        :border="false"
        :show-header="true"
        :header-row-class-name="'table-header-row'"
        :row-class-name="'table-row'"
        element-loading-text="加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
      >
        <!-- ID列 -->
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          sortable
          class-name="id-column"
        >
          <template #default="{ row }">
            <span class="id-badge">#{{ row.id }}</span>
          </template>
        </el-table-column>

        <!-- 动态列 -->
        <template v-for="column in columns" :key="column.prop">
          <el-table-column
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :min-width="column.minWidth"
            :sortable="column.sortable"
            :show-overflow-tooltip="column.showOverflowTooltip"
          >
            <template #default="{ row }">
              <slot
                :name="`column-${column.prop}`"
                :row="row"
                :value="row[column.prop]"
                :column="column"
              >
                <!-- 默认渲染 -->
                <component
                  :is="getColumnComponent(column)"
                  :row="row"
                  :column="column"
                  :value="row[column.prop]"
                />
              </slot>
            </template>
          </el-table-column>
        </template>

        <!-- 操作列 -->
        <el-table-column
          label="操作"
          width="160"
          fixed="right"
          class-name="action-column"
        >
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button
                type="primary"
                link
                size="small"
                class="edit-btn"
                @click="handleEdit(row)"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                class="delete-btn"
                @click="handleDelete(row)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          class="modern-pagination"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 表单弹窗 -->
    <FormDialog
      v-model:visible="dialogVisible"
      v-model:form-data="formData"
      :title="dialogTitle"
      :fields="formFields"
      :loading="submitLoading"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import SearchFilters from './SearchFilters.vue'
import FormDialog from './FormDialog.vue'
import ColumnText from './table-columns/ColumnText.vue'
import ColumnTag from './table-columns/ColumnTag.vue'
import ColumnDate from './table-columns/ColumnDate.vue'
import ColumnAvatar from './table-columns/ColumnAvatar.vue'
import ColumnStatus from './table-columns/ColumnStatus.vue'

const props = defineProps({
  // 表格配置
  config: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      subtitle: '',
      icon: 'Menu',
      createText: '新建'
    })
  },
  // 列配置
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  // 搜索字段
  searchFields: {
    type: Array,
    default: () => []
  },
  // 表单字段
  formFields: {
    type: Array,
    required: true,
    default: () => []
  },
  // API服务
  apiService: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['create', 'edit', 'delete'])

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
const submitLoading = ref(false)
const formData = ref({})

const dialogTitle = computed(() => formData.value.id ? '编辑' : '创建')

// 获取列组件
const getColumnComponent = (column) => {
  switch (column.type) {
    case 'tag': return ColumnTag
    case 'date': return ColumnDate
    case 'avatar': return ColumnAvatar
    case 'status': return ColumnStatus
    default: return ColumnText
  }
}

// 获取数据列表
const fetchData = async () => {
  if (!props.apiService || !props.apiService.getList) {
    console.warn('API service or getList method not provided')
    return
  }

  loading.value = true
  try {
    // 过滤空值参数
    const filteredParams = Object.entries(searchParams.value).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    }, {})

    const params = {
      page: pagination.page,
      page_size: pagination.pageSize,
      ...filteredParams
    }
    const response = await props.apiService.getList(params)

    // Add safety checks for response structure based on OpenAPI
    if (response && response.data) {
      // Check if response follows pagination format
      if (response.data.items && response.data.pagination) {
        tableData.value = response.data.items || []
        pagination.total = response.data.pagination.total || 0
      } else if (response.data.items) {
        // Fallback for simple items structure
        tableData.value = response.data.items || []
        pagination.total = response.data.total || 0
      } else {
        // Direct data format
        tableData.value = response.data || []
        pagination.total = response.total || 0
      }
    } else {
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('API Error:', error)
    ElMessage.error(`获取${props.config.title}失败: ${error.message || error}`)
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 重置处理
const handleReset = () => {
  searchParams.value = {}
  pagination.page = 1
  fetchData()
}

// 创建处理
const handleCreate = () => {
  formData.value = {}
  dialogVisible.value = true
  emit('create', { formData: formData.value })
}

// 编辑处理
const handleEdit = (row) => {
  formData.value = { ...row }
  dialogVisible.value = true
  emit('edit', { row, formData: formData.value })
}

// 删除处理
const handleDelete = async (row) => {
  if (!props.apiService.delete) return

  try {
    await ElMessageBox.confirm(
      `确定要删除"${row.name || row.title || row.id}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await props.apiService.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
    emit('delete', { row })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async (data) => {
  if (!props.apiService.create && !props.apiService.update) return

  submitLoading.value = true
  try {
    if (data.id) {
      await props.apiService.update(data.id, data)
      ElMessage.success('更新成功')
    } else {
      await props.apiService.create(data)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error(data.id ? '更新失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 分页处理
const handleCurrentChange = (page) => {
  pagination.page = page
  fetchData()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchData()
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})

// 暴露方法
defineExpose({
  refresh: fetchData,
  resetSearch: handleReset
})
</script>

<style scoped>
.data-table-container {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.8) inset;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-section .page-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  font-size: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  margin: 8px 0 0 48px;
  font-size: 16px;
  color: #6b7280;
  font-weight: 400;
}

.create-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 16px;
  padding: 14px 28px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

/* 表格卡片 */
.table-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 0;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.8) inset;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.table-header {
  padding: 24px 32px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.total-count {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* 表格样式 */
.modern-table {
  border-radius: 0;
}

.modern-table :deep(.el-table__header-wrapper) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.modern-table :deep(.table-header-row) {
  background: transparent;
}

.modern-table :deep(.table-header-row th) {
  background: transparent;
  border: none;
  font-weight: 700;
  color: #374151;
  font-size: 14px;
  padding: 20px 16px;
}

.modern-table :deep(.table-row td) {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.modern-table :deep(.table-row:hover td) {
  background: rgba(102, 126, 234, 0.02);
}

.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.edit-btn, .delete-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* 分页 */
.pagination-wrapper {
  padding: 24px 32px;
  border-top: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.modern-pagination :deep(.el-pagination.is-background .el-pager li) {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin: 0 4px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modern-pagination :deep(.el-pagination.is-background .el-pager li.is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}

.modern-pagination :deep(.btn-prev),
.modern-pagination :deep(.btn-next) {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modern-pagination :deep(.btn-prev:hover),
.modern-pagination :deep(.btn-next:hover) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-table-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
  }

  .title-section .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    margin-left: 40px;
    font-size: 14px;
  }

  .table-card {
    padding: 16px;
  }
}
</style>