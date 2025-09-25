<template>
  <div class="column-status">
    <div :class="['status-indicator', statusClass]"></div>
    <span class="status-text">{{ statusText }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: ''
  },
  row: {
    type: Object,
    default: () => ({})
  },
  column: {
    type: Object,
    default: () => ({})
  }
})

const statusClass = computed(() => {
  if (props.column.statusMap && props.column.statusMap[props.value]) {
    return `status-${props.column.statusMap[props.value].type || 'default'}`
  }

  // Default status mapping
  if (props.value === true || props.value === 1 || props.value === 'active') {
    return 'status-success'
  } else if (props.value === false || props.value === 0 || props.value === 'inactive') {
    return 'status-danger'
  }

  return 'status-default'
})

const statusText = computed(() => {
  if (props.column.statusMap && props.column.statusMap[props.value]) {
    return props.column.statusMap[props.value].text || props.value
  }

  // Default status text
  if (props.value === true || props.value === 1 || props.value === 'active') {
    return '启用'
  } else if (props.value === false || props.value === 0 || props.value === 'inactive') {
    return '禁用'
  }

  return props.value || '--'
})
</script>

<style scoped>
.column-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-success {
  background: #10b981;
}

.status-danger {
  background: #ef4444;
}

.status-warning {
  background: #f59e0b;
}

.status-info {
  background: #3b82f6;
}

.status-default {
  background: #6b7280;
}

.status-text {
  color: #374151;
  font-weight: 500;
  font-size: 13px;
}
</style>