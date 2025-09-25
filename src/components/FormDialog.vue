<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    :before-close="handleClose"
    class="modern-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    destroy-on-close
  >
    <DynamicForm
      v-model="formData"
      :fields="fields"
      :submit-loading="loading"
      :show-actions="false"
      class="form-content"
    />

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="cancel-btn">
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
          class="submit-btn"
        >
          <el-icon v-if="!loading"><Check /></el-icon>
          {{ submitText || (formData.id ? '更新' : '创建') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Check } from '@element-plus/icons-vue'
import DynamicForm from './DynamicForm.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  fields: {
    type: Array,
    required: true,
    default: () => []
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'update:form-data', 'submit', 'close'])

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const formData = computed({
  get: () => props.formData,
  set: (value) => emit('update:form-data', value)
})

const handleSubmit = () => {
  emit('submit', formData.value)
}

const handleClose = () => {
  visible.value = false
  emit('close')
}
</script>

<style scoped>
/* 弹窗样式 */
.modern-dialog :deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modern-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
}

.modern-dialog :deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 700;
  color: #374151;
}

.modern-dialog :deep(.el-dialog__body) {
  padding: 32px;
}

.form-content :deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
}

.form-content :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.form-content :deep(.el-input__wrapper:hover) {
  border-color: #667eea;
}

.form-content :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-content :deep(.el-textarea__inner) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.form-content :deep(.el-textarea__inner:hover) {
  border-color: #667eea;
}

.form-content :deep(.el-textarea__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 24px 32px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  color: #6b7280;
  background: white;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}
</style>