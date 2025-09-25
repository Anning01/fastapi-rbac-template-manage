<template>
  <div class="search-card">
    <div class="search-header">
      <el-icon class="search-icon"><Search /></el-icon>
      <span class="search-title">筛选条件</span>
    </div>
    <el-form :model="formData" class="search-form">
      <el-row :gutter="20">
        <template v-for="field in fields" :key="field.prop">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item :label="field.label">
              <!-- 输入框 -->
              <el-input
                v-if="!field.type || field.type === 'input'"
                v-model="formData[field.prop]"
                :placeholder="field.placeholder"
                clearable
                class="search-input"
                @keyup.enter="handleSearch"
              >
                <template v-if="field.prefixIcon" #prefix>
                  <el-icon><component :is="field.prefixIcon" /></el-icon>
                </template>
              </el-input>

              <!-- 选择器 -->
              <el-select
                v-else-if="field.type === 'select'"
                v-model="formData[field.prop]"
                :placeholder="field.placeholder"
                clearable
                class="search-select"
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <el-option
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>

              <!-- 日期选择 -->
              <el-date-picker
                v-else-if="field.type === 'date'"
                v-model="formData[field.prop]"
                :type="field.dateType || 'date'"
                :placeholder="field.placeholder"
                clearable
                class="search-date"
                style="width: 100%"
              />

              <!-- 日期范围选择 -->
              <el-date-picker
                v-else-if="field.type === 'daterange'"
                v-model="formData[field.prop]"
                type="daterange"
                :placeholder="field.placeholder"
                :start-placeholder="field.startPlaceholder || '开始日期'"
                :end-placeholder="field.endPlaceholder || '结束日期'"
                clearable
                class="search-date"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </template>

        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item>
            <div class="search-buttons">
              <el-button type="primary" @click="handleSearch" class="search-btn">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
              <el-button @click="handleReset" class="reset-btn">
                <el-icon><RefreshLeft /></el-icon>
                重置
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'

const props = defineProps({
  fields: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'reset'])

const formData = reactive({})

// 初始化表单数据
const initFormData = () => {
  props.fields.forEach(field => {
    formData[field.prop] = props.modelValue[field.prop] || field.defaultValue || ''
  })
}

// 处理搜索
const handleSearch = () => {
  emit('update:modelValue', { ...formData })
  emit('search', { ...formData })
}

// 处理重置
const handleReset = () => {
  props.fields.forEach(field => {
    formData[field.prop] = field.defaultValue || ''
  })
  emit('update:modelValue', { ...formData })
  emit('reset')
}

// 监听字段变化
watch(() => props.fields, initFormData, { immediate: true, deep: true })

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  Object.keys(newValue).forEach(key => {
    if (formData.hasOwnProperty(key)) {
      formData[key] = newValue[key]
    }
  })
}, { immediate: true, deep: true })

onMounted(() => {
  initFormData()
})
</script>

<style scoped>
.search-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.8) inset;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.search-icon {
  font-size: 20px;
  color: #667eea;
}

.search-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.search-form :deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #667eea;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-select :deep(.el-input__wrapper),
.search-date :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-select :deep(.el-input__wrapper:hover),
.search-date :deep(.el-input__wrapper:hover) {
  border-color: #667eea;
}

.search-select :deep(.el-input__wrapper.is-focus),
.search-date :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-buttons {
  display: flex;
  gap: 12px;
}

.search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
}

.reset-btn {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  color: #6b7280;
  background: white;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  border-color: #667eea;
  color: #667eea;
}
</style>