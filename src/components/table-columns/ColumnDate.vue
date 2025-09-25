<template>
  <span class="column-date">{{ formattedDate }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [String, Date],
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

const formattedDate = computed(() => {
  if (!props.value) return '--'

  const format = props.column.format || 'YYYY-MM-DD HH:mm:ss'
  const date = new Date(props.value)

  if (isNaN(date.getTime())) return '--'

  // Simple date formatting
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  if (format.includes('HH:mm:ss')) {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } else {
    return `${year}-${month}-${day}`
  }
})
</script>

<style scoped>
.column-date {
  color: #6b7280;
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>