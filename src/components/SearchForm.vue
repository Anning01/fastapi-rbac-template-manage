<template>
  <div class="search-form">
    <el-form
      ref="formRef"
      :model="searchForm"
      :inline="inline"
      :label-width="labelWidth"
      :size="size"
    >
      <template v-for="field in fields" :key="field.prop">
        <el-form-item
          :label="field.label"
          :prop="field.prop"
          :rules="field.rules"
        >
          <!-- 文本输入 -->
          <el-input
            v-if="!field.type || field.type === 'input'"
            v-model="searchForm[field.prop]"
            :placeholder="field.placeholder || `请输入${field.label}`"
            :clearable="field.clearable !== false"
            :disabled="field.disabled"
            :maxlength="field.maxlength"
            @keyup.enter="handleSearch"
          />

          <!-- 选择器 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="searchForm[field.prop]"
            :placeholder="field.placeholder || `请选择${field.label}`"
            :clearable="field.clearable !== false"
            :disabled="field.disabled"
            :multiple="field.multiple"
            :filterable="field.filterable"
            :remote="field.remote"
            :remote-method="field.remoteMethod"
            :loading="field.loading"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :disabled="option.disabled"
            />
          </el-select>

          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="searchForm[field.prop]"
            :type="field.dateType || 'date'"
            :placeholder="field.placeholder || `请选择${field.label}`"
            :format="field.format"
            :value-format="field.valueFormat"
            :clearable="field.clearable !== false"
            :disabled="field.disabled"
            :shortcuts="field.shortcuts"
          />

          <!-- 日期范围选择器 -->
          <el-date-picker
            v-else-if="field.type === 'daterange'"
            v-model="searchForm[field.prop]"
            type="daterange"
            :placeholder="field.placeholder"
            :start-placeholder="field.startPlaceholder || '开始日期'"
            :end-placeholder="field.endPlaceholder || '结束日期'"
            :format="field.format"
            :value-format="field.valueFormat"
            :clearable="field.clearable !== false"
            :disabled="field.disabled"
            :shortcuts="field.shortcuts"
          />

          <!-- 数字输入 -->
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="searchForm[field.prop]"
            :placeholder="field.placeholder || `请输入${field.label}`"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            :precision="field.precision"
            :disabled="field.disabled"
            :controls="field.controls !== false"
          />

          <!-- 开关 -->
          <el-switch
            v-else-if="field.type === 'switch'"
            v-model="searchForm[field.prop]"
            :disabled="field.disabled"
            :active-text="field.activeText"
            :inactive-text="field.inactiveText"
            :active-value="field.activeValue"
            :inactive-value="field.inactiveValue"
          />

          <!-- 级联选择器 -->
          <el-cascader
            v-else-if="field.type === 'cascader'"
            v-model="searchForm[field.prop]"
            :options="field.options"
            :placeholder="field.placeholder || `请选择${field.label}`"
            :clearable="field.clearable !== false"
            :disabled="field.disabled"
            :filterable="field.filterable"
            :show-all-levels="field.showAllLevels"
            :props="field.props"
          />

          <!-- 自定义插槽 -->
          <slot
            v-else-if="field.type === 'slot'"
            :name="field.slot"
            :field="field"
            :value="searchForm[field.prop]"
            :setValue="(value) => searchForm[field.prop] = value"
          />
        </el-form-item>
      </template>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          :icon="Refresh"
          @click="handleReset"
        >
          重置
        </el-button>
        <el-button
          v-if="showCollapse && fields.length > collapseCount"
          type="primary"
          link
          @click="toggleCollapse"
        >
          {{ collapsed ? '展开' : '收起' }}
          <el-icon>
            <ArrowDown v-if="collapsed" />
            <ArrowUp v-else />
          </el-icon>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Search, Refresh, ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const props = defineProps({
  // 搜索字段配置
  fields: {
    type: Array,
    default: () => []
  },
  // 表单属性
  inline: {
    type: Boolean,
    default: true
  },
  labelWidth: {
    type: String,
    default: '80px'
  },
  size: {
    type: String,
    default: 'default'
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 初始值
  modelValue: {
    type: Object,
    default: () => ({})
  },
  // 折叠功能
  showCollapse: {
    type: Boolean,
    default: true
  },
  collapseCount: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['search', 'reset', 'update:modelValue'])

const formRef = ref()
const collapsed = ref(true)
const searchForm = reactive({})

// 初始化表单数据
const initFormData = () => {
  props.fields.forEach(field => {
    if (field.prop) {
      searchForm[field.prop] = props.modelValue[field.prop] || field.defaultValue || ''
    }
  })
}

// 显示的字段（支持折叠）
const visibleFields = computed(() => {
  if (!props.showCollapse || !collapsed.value) {
    return props.fields
  }
  return props.fields.slice(0, props.collapseCount)
})

// 切换折叠状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

// 处理搜索
const handleSearch = () => {
  const searchData = { ...searchForm }
  // 清理空值
  Object.keys(searchData).forEach(key => {
    if (searchData[key] === '' || searchData[key] === null || searchData[key] === undefined) {
      delete searchData[key]
    }
  })
  emit('search', searchData)
  emit('update:modelValue', searchData)
}

// 处理重置
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 重置为默认值
  props.fields.forEach(field => {
    if (field.prop) {
      searchForm[field.prop] = field.defaultValue || ''
    }
  })
  emit('reset')
  emit('update:modelValue', {})
}

// 监听字段变化，重新初始化表单
watch(() => props.fields, initFormData, { immediate: true, deep: true })
watch(() => props.modelValue, (newValue) => {
  Object.assign(searchForm, newValue)
}, { immediate: true, deep: true })

// 暴露方法给父组件
defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: () => formRef.value?.clearValidate()
})
</script>

<style scoped>
.search-form {
  background: var(--bg-primary);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
  margin-right: 16px;
}

:deep(.el-form-item__content) {
  min-width: 200px;
}

:deep(.el-date-editor.el-input) {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-cascader) {
  width: 100%;
}
</style>