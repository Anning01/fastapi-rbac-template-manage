<template>
  <span class="column-text">{{ displayValue }}</span>
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

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return props.column.emptyText || '--'
  }
  return props.value
})
</script>

<style scoped>
.column-text {
  color: #374151;
  font-weight: 500;
}
</style>