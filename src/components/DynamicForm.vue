<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :size="size"
    :disabled="disabled"
  >
    <template v-for="field in fields" :key="field.prop">
      <el-form-item
        :label="field.label"
        :prop="field.prop"
        :required="field.required"
        :rules="field.rules"
      >
        <!-- 文本输入 -->
        <el-input
          v-if="!field.type || field.type === 'input'"
          v-model="formData[field.prop]"
          :type="field.inputType || 'text'"
          :placeholder="field.placeholder || `请输入${field.label}`"
          :clearable="field.clearable !== false"
          :disabled="field.disabled"
          :readonly="field.readonly"
          :maxlength="field.maxlength"
          :show-word-limit="field.showWordLimit"
          :prefix-icon="field.prefixIcon"
          :suffix-icon="field.suffixIcon"
        />

        <!-- 文本域 -->
        <el-input
          v-else-if="field.type === 'textarea'"
          v-model="formData[field.prop]"
          type="textarea"
          :placeholder="field.placeholder || `请输入${field.label}`"
          :disabled="field.disabled"
          :readonly="field.readonly"
          :maxlength="field.maxlength"
          :show-word-limit="field.showWordLimit"
          :rows="field.rows || 3"
          :autosize="field.autosize"
        />

        <!-- 密码输入 -->
        <el-input
          v-else-if="field.type === 'password'"
          v-model="formData[field.prop]"
          type="password"
          :placeholder="field.placeholder || `请输入${field.label}`"
          :clearable="field.clearable !== false"
          :disabled="field.disabled"
          :show-password="field.showPassword !== false"
        />

        <!-- 数字输入 -->
        <el-input-number
          v-else-if="field.type === 'number'"
          v-model="formData[field.prop]"
          :placeholder="field.placeholder || `请输入${field.label}`"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :precision="field.precision"
          :disabled="field.disabled"
          :controls="field.controls !== false"
          :controls-position="field.controlsPosition"
          style="width: 100%"
        />

        <!-- 选择器 -->
        <el-select
          v-else-if="field.type === 'select'"
          v-model="formData[field.prop]"
          :placeholder="field.placeholder || `请选择${field.label}`"
          :clearable="field.clearable !== false"
          :disabled="field.disabled"
          :multiple="field.multiple"
          :filterable="field.filterable"
          :remote="field.remote"
          :remote-method="field.remoteMethod"
          :loading="field.loading"
          :collapse-tags="field.collapseTags"
          :collapse-tags-tooltip="field.collapseTagsTooltip"
          style="width: 100%"
        >
          <el-option
            v-for="option in field.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
            :disabled="option.disabled"
          />
        </el-select>

        <!-- 单选框组 -->
        <el-radio-group
          v-else-if="field.type === 'radio'"
          v-model="formData[field.prop]"
          :disabled="field.disabled"
        >
          <el-radio
            v-for="option in field.options"
            :key="option.value"
            :label="option.value"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>

        <!-- 复选框组 -->
        <el-checkbox-group
          v-else-if="field.type === 'checkbox'"
          v-model="formData[field.prop]"
          :disabled="field.disabled"
        >
          <el-checkbox
            v-for="option in field.options"
            :key="option.value"
            :label="option.value"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </el-checkbox>
        </el-checkbox-group>

        <!-- 开关 -->
        <el-switch
          v-else-if="field.type === 'switch'"
          v-model="formData[field.prop]"
          :disabled="field.disabled"
          :active-text="field.activeText"
          :inactive-text="field.inactiveText"
          :active-value="field.activeValue"
          :inactive-value="field.inactiveValue"
        />

        <!-- 日期选择器 -->
        <el-date-picker
          v-else-if="field.type === 'date'"
          v-model="formData[field.prop]"
          :type="field.dateType || 'date'"
          :placeholder="field.placeholder || `请选择${field.label}`"
          :format="field.format"
          :value-format="field.valueFormat"
          :clearable="field.clearable !== false"
          :disabled="field.disabled"
          :shortcuts="field.shortcuts"
          style="width: 100%"
        />

        <!-- 时间选择器 -->
        <el-time-picker
          v-else-if="field.type === 'time'"
          v-model="formData[field.prop]"
          :placeholder="field.placeholder || `请选择${field.label}`"
          :format="field.format"
          :value-format="field.valueFormat"
          :clearable="field.clearable !== false"
          :disabled="field.disabled"
          style="width: 100%"
        />

        <!-- 级联选择器 -->
        <el-cascader
          v-else-if="field.type === 'cascader'"
          v-model="formData[field.prop]"
          :options="field.options"
          :placeholder="field.placeholder || `请选择${field.label}`"
          :clearable="field.clearable !== false"
          :disabled="field.disabled"
          :filterable="field.filterable"
          :show-all-levels="field.showAllLevels"
          :props="field.props"
          style="width: 100%"
        />

        <!-- 滑块 -->
        <el-slider
          v-else-if="field.type === 'slider'"
          v-model="formData[field.prop]"
          :min="field.min || 0"
          :max="field.max || 100"
          :step="field.step"
          :disabled="field.disabled"
          :show-input="field.showInput"
          :show-input-controls="field.showInputControls"
          :range="field.range"
        />

        <!-- 评分 -->
        <el-rate
          v-else-if="field.type === 'rate'"
          v-model="formData[field.prop]"
          :max="field.max || 5"
          :disabled="field.disabled"
          :allow-half="field.allowHalf"
          :show-text="field.showText"
          :show-score="field.showScore"
          :texts="field.texts"
        />

        <!-- 颜色选择器 -->
        <el-color-picker
          v-else-if="field.type === 'color'"
          v-model="formData[field.prop]"
          :disabled="field.disabled"
          :show-alpha="field.showAlpha"
          :color-format="field.colorFormat"
          :predefine="field.predefine"
        />

        <!-- 上传组件 -->
        <el-upload
          v-else-if="field.type === 'upload'"
          :action="field.action"
          :headers="field.headers"
          :data="field.data"
          :name="field.name || 'file'"
          :with-credentials="field.withCredentials"
          :multiple="field.multiple"
          :accept="field.accept"
          :auto-upload="field.autoUpload !== false"
          :disabled="field.disabled"
          :limit="field.limit"
          :on-success="(response, file, fileList) => handleUploadSuccess(field, response, file, fileList)"
          :on-error="(error, file, fileList) => handleUploadError(field, error, file, fileList)"
          :before-upload="field.beforeUpload"
          :on-remove="(file, fileList) => handleUploadRemove(field, file, fileList)"
        >
          <el-button :icon="field.uploadIcon || 'Upload'" :disabled="field.disabled">
            {{ field.uploadText || '点击上传' }}
          </el-button>
          <template v-if="field.tip" #tip>
            <div class="upload-tip">{{ field.tip }}</div>
          </template>
        </el-upload>

        <!-- 自定义插槽 -->
        <slot
          v-else-if="field.type === 'slot'"
          :name="field.slot"
          :field="field"
          :value="formData[field.prop]"
          :setValue="(value) => formData[field.prop] = value"
          :form-data="formData"
        />

        <!-- 帮助文本 -->
        <div v-if="field.help" class="field-help">
          {{ field.help }}
        </div>
      </el-form-item>
    </template>

    <!-- 表单操作按钮 -->
    <el-form-item v-if="showActions">
      <slot name="actions" :form-data="formData" :validate="validate" :reset="resetForm">
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ submitText }}
        </el-button>
        <el-button @click="handleReset">
          {{ resetText }}
        </el-button>
        <el-button v-if="showCancel" @click="handleCancel">
          {{ cancelText }}
        </el-button>
      </slot>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  // 表单字段配置
  fields: {
    type: Array,
    default: () => []
  },
  // 表单数据
  modelValue: {
    type: Object,
    default: () => ({})
  },
  // 表单属性
  labelWidth: {
    type: String,
    default: '120px'
  },
  labelPosition: {
    type: String,
    default: 'right'
  },
  size: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // 按钮配置
  showActions: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    default: '确定'
  },
  resetText: {
    type: String,
    default: '重置'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  submitLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'reset', 'cancel', 'upload-success', 'upload-error', 'upload-remove'])

const formRef = ref()
const formData = reactive({})

// 计算表单规则
const formRules = computed(() => {
  const rules = {}
  props.fields.forEach(field => {
    if (field.rules) {
      rules[field.prop] = field.rules
    } else if (field.required) {
      const message = field.requiredMessage || `请${getRequiredPrefix(field.type)}${field.label}`
      rules[field.prop] = [{ required: true, message, trigger: getValidationTrigger(field.type) }]
    }
  })
  return rules
})

// 获取必填验证前缀
const getRequiredPrefix = (type) => {
  const inputTypes = ['input', 'textarea', 'password', 'number']
  const selectTypes = ['select', 'cascader', 'date', 'time']

  if (inputTypes.includes(type)) return '输入'
  if (selectTypes.includes(type)) return '选择'
  return '填写'
}

// 获取验证触发方式
const getValidationTrigger = (type) => {
  const changeTypes = ['select', 'radio', 'checkbox', 'switch', 'cascader', 'date', 'time', 'slider', 'rate', 'color']
  return changeTypes.includes(type) ? 'change' : 'blur'
}

// 初始化表单数据
const initFormData = () => {
  // 清空现有数据
  Object.keys(formData).forEach(key => {
    delete formData[key]
  })

  // 设置字段默认值
  props.fields.forEach(field => {
    if (field.prop) {
      formData[field.prop] = props.modelValue[field.prop] ?? field.defaultValue ?? getDefaultValue(field.type)
    }
  })
}

// 获取字段类型默认值
const getDefaultValue = (type) => {
  switch (type) {
    case 'checkbox':
      return []
    case 'switch':
      return false
    case 'number':
      return null
    default:
      return ''
  }
}

// 表单验证
const validate = () => {
  return formRef.value?.validate()
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  initFormData()
}

// 清除验证
const clearValidate = () => {
  formRef.value?.clearValidate()
}

// 处理提交
const handleSubmit = async () => {
  try {
    const valid = await validate()
    if (valid) {
      emit('submit', { ...formData })
      emit('update:modelValue', { ...formData })
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 处理重置
const handleReset = () => {
  resetForm()
  emit('reset')
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}

// 处理上传成功
const handleUploadSuccess = (field, response, file, fileList) => {
  emit('upload-success', { field, response, file, fileList })
}

// 处理上传错误
const handleUploadError = (field, error, file, fileList) => {
  emit('upload-error', { field, error, file, fileList })
}

// 处理上传移除
const handleUploadRemove = (field, file, fileList) => {
  emit('upload-remove', { field, file, fileList })
}

// 监听字段变化
watch(() => props.fields, initFormData, { immediate: true, deep: true })

// 监听modelValue变化，单向同步到formData
watch(() => props.modelValue, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    // 使用深拷贝避免引用问题，并防止循环更新
    const clonedValue = JSON.parse(JSON.stringify(newValue))
    Object.keys(formData).forEach(key => {
      if (clonedValue.hasOwnProperty(key) && formData[key] !== clonedValue[key]) {
        formData[key] = clonedValue[key]
      }
    })
  }
}, { immediate: true, deep: true })

// 防抖的表单数据更新
let updateTimeout = null
const debouncedUpdate = (newValue) => {
  if (updateTimeout) clearTimeout(updateTimeout)
  updateTimeout = setTimeout(() => {
    emit('update:modelValue', { ...newValue })
  }, 16) // 16ms防抖，约等于一帧的时间
}

// 监听表单数据变化，同步到父组件（使用防抖避免频繁更新）
watch(formData, (newValue) => {
  debouncedUpdate(newValue)
}, { deep: true })

// 暴露方法给父组件
defineExpose({
  validate,
  resetFields: resetForm,
  clearValidate,
  formData
})
</script>

<style scoped>
.field-help {
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 4px;
  line-height: 1.4;
}

.upload-tip {
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 4px;
}

:deep(.el-form-item__content) {
  flex-wrap: wrap;
}

:deep(.el-upload__tip) {
  margin-top: 4px;
}
</style>