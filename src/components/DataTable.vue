<template>
  <div class="data-table">
    <!-- 搜索区域 -->
    <div v-if="showSearch" class="search-section">
      <SearchForm
        :fields="searchFields"
        :loading="loading"
        @search="handleSearch"
        @reset="handleReset"
      />
    </div>

    <!-- 操作按钮区域 -->
    <div v-if="showActions" class="action-section">
      <div class="action-left">
        <el-button
          v-for="action in leftActions"
          :key="action.key"
          :type="action.type || 'primary'"
          :icon="action.icon"
          :disabled="action.disabled"
          @click="handleAction(action)"
        >
          {{ action.label }}
        </el-button>
      </div>
      <div class="action-right">
        <el-button
          v-for="action in rightActions"
          :key="action.key"
          :type="action.type || 'default'"
          :icon="action.icon"
          :disabled="action.disabled"
          @click="handleAction(action)"
        >
          {{ action.label }}
        </el-button>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      :stripe="stripe"
      :border="border"
      :size="size"
      :height="height"
      :max-height="maxHeight"
      :row-key="rowKey"
      :selection="selection"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblClick"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="selection"
        type="selection"
        width="55"
        align="center"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        align="center"
        :index="getIndex"
      />

      <!-- 数据列 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :align="column.align || 'left'"
        :sortable="column.sortable"
        :show-overflow-tooltip="column.showOverflowTooltip !== false"
      >
        <template #default="{ row, column: col, $index }">
          <!-- 自定义插槽 -->
          <slot
            v-if="column.slot"
            :name="column.slot"
            :row="row"
            :column="col"
            :index="$index"
            :value="row[column.prop]"
          />
          <!-- 状态标签 -->
          <el-tag
            v-else-if="column.type === 'tag'"
            :type="getTagType(row[column.prop], column.tagMap)"
            :effect="column.tagEffect || 'light'"
          >
            {{ getTagText(row[column.prop], column.tagMap) }}
          </el-tag>
          <!-- 开关 -->
          <el-switch
            v-else-if="column.type === 'switch'"
            :model-value="row[column.prop]"
            :disabled="column.disabled"
            @change="handleSwitchChange(row, column.prop, $event)"
          />
          <!-- 日期格式化 -->
          <span v-else-if="column.type === 'date'">
            {{ formatDate(row[column.prop], column.format) }}
          </span>
          <!-- 默认文本 -->
          <span v-else>
            {{ formatValue(row[column.prop], column) }}
          </span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="rowActions && rowActions.length > 0"
        label="操作"
        :width="actionColumnWidth"
        :fixed="actionColumnFixed"
        align="center"
      >
        <template #default="{ row, $index }">
          <div class="row-actions">
            <template v-for="action in getRowActions(row)" :key="action.key">
              <!-- 按钮操作 -->
              <el-button
                v-if="!action.type || action.type === 'button'"
                :type="action.buttonType || 'primary'"
                :size="action.size || 'small'"
                :icon="action.icon"
                :disabled="action.disabled"
                :link="action.link"
                @click="handleRowAction(action, row, $index)"
              >
                {{ action.label }}
              </el-button>
              <!-- 下拉菜单操作 -->
              <el-dropdown
                v-else-if="action.type === 'dropdown'"
                @command="(command) => handleDropdownAction(command, row, $index)"
              >
                <el-button :type="action.buttonType || 'primary'" :size="action.size || 'small'">
                  {{ action.label }}
                  <el-icon class="el-icon--right">
                    <ArrowDown />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in action.items"
                      :key="item.key"
                      :command="{ action: item, row, index: $index }"
                      :disabled="item.disabled"
                    >
                      <el-icon v-if="item.icon">
                        <component :is="item.icon" />
                      </el-icon>
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div v-if="showPagination" class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :background="paginationBackground"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { dayjs } from 'element-plus'
import SearchForm from './SearchForm.vue'

const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => []
  },
  // 表格列配置
  columns: {
    type: Array,
    default: () => []
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 表格属性
  stripe: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'default'
  },
  height: String,
  maxHeight: String,
  rowKey: String,
  // 选择功能
  selection: {
    type: Boolean,
    default: false
  },
  // 显示序号
  showIndex: {
    type: Boolean,
    default: true
  },
  // 搜索功能
  showSearch: {
    type: Boolean,
    default: true
  },
  searchFields: {
    type: Array,
    default: () => []
  },
  // 操作按钮
  showActions: {
    type: Boolean,
    default: true
  },
  leftActions: {
    type: Array,
    default: () => []
  },
  rightActions: {
    type: Array,
    default: () => []
  },
  // 行操作
  rowActions: {
    type: Array,
    default: () => []
  },
  actionColumnWidth: {
    type: String,
    default: '160'
  },
  actionColumnFixed: {
    type: String,
    default: 'right'
  },
  // 分页
  showPagination: {
    type: Boolean,
    default: true
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      pageSize: 10,
      total: 0
    })
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  paginationBackground: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'search',
  'reset',
  'action',
  'row-action',
  'selection-change',
  'sort-change',
  'row-click',
  'row-dblclick',
  'size-change',
  'current-change',
  'switch-change'
])

const tableData = computed(() => props.data)
const selectedRows = ref([])

// 获取序号
const getIndex = (index) => {
  return (props.pagination.page - 1) * props.pagination.pageSize + index + 1
}

// 处理搜索
const handleSearch = (searchData) => {
  emit('search', searchData)
}

// 处理重置
const handleReset = () => {
  emit('reset')
}

// 处理操作按钮点击
const handleAction = (action) => {
  emit('action', { action, selectedRows: selectedRows.value })
}

// 处理行操作
const handleRowAction = (action, row, index) => {
  emit('row-action', { action, row, index })
}

// 处理下拉操作
const handleDropdownAction = (command) => {
  const { action, row, index } = command
  emit('row-action', { action, row, index })
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

// 处理排序变化
const handleSortChange = (sortData) => {
  emit('sort-change', sortData)
}

// 处理行点击
const handleRowClick = (row, column, event) => {
  emit('row-click', { row, column, event })
}

// 处理行双击
const handleRowDblClick = (row, column, event) => {
  emit('row-dblclick', { row, column, event })
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  emit('size-change', size)
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  emit('current-change', page)
}

// 处理开关变化
const handleSwitchChange = (row, prop, value) => {
  emit('switch-change', { row, prop, value })
}

// 获取标签类型
const getTagType = (value, tagMap) => {
  if (!tagMap) return 'info'
  const config = tagMap[value]
  return config?.type || 'info'
}

// 获取标签文本
const getTagText = (value, tagMap) => {
  if (!tagMap) return value
  const config = tagMap[value]
  return config?.text || value
}

// 格式化日期
const formatDate = (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!value) return '-'
  return dayjs(value).format(format)
}

// 格式化值
const formatValue = (value, column) => {
  if (value === null || value === undefined || value === '') {
    return column.emptyText || '-'
  }
  return value
}

// 获取行操作按钮
const getRowActions = (row) => {
  return props.rowActions.filter(action => {
    if (typeof action.show === 'function') {
      return action.show(row)
    }
    return action.show !== false
  })
}

// 暴露方法给父组件
defineExpose({
  selectedRows,
  clearSelection: () => {
    selectedRows.value = []
  }
})
</script>

<style scoped>
.data-table {
  background: var(--bg-primary);
  border-radius: 8px;
  overflow: hidden;
}

.search-section {
  padding: 20px 20px 0;
  border-bottom: 1px solid var(--border-color);
}

.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.action-left,
.action-right {
  display: flex;
  gap: 8px;
}

.row-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  background: var(--bg-primary);
}

:deep(.el-table) {
  --el-table-border-color: var(--border-color);
  --el-table-bg-color: var(--bg-primary);
}

:deep(.el-table__header) {
  background: var(--bg-secondary);
}
</style>