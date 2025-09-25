<template>
  <div class="column-avatar">
    <el-avatar
      :size="size"
      :src="avatarSrc"
      :alt="displayName"
      class="avatar"
    >
      {{ avatarText }}
    </el-avatar>
    <span v-if="showName" class="avatar-name">{{ displayName }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [String, Object],
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

const size = computed(() => props.column.size || 32)
const showName = computed(() => props.column.showName !== false)

const avatarSrc = computed(() => {
  if (typeof props.value === 'object' && props.value.avatar) {
    return props.value.avatar
  }
  return props.column.defaultAvatar || ''
})

const displayName = computed(() => {
  if (typeof props.value === 'object' && props.value.name) {
    return props.value.name
  }
  return props.value || props.row.name || '--'
})

const avatarText = computed(() => {
  if (!displayName.value || displayName.value === '--') return '?'
  return displayName.value.charAt(0).toUpperCase()
})
</script>

<style scoped>
.column-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.avatar-name {
  color: #374151;
  font-weight: 500;
}
</style>