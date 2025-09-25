<template>
  <el-tag :type="tagType" :effect="tagEffect" class="column-tag">
    {{ displayText }}
  </el-tag>
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

const tagType = computed(() => {
  if (props.column.tagMap && props.column.tagMap[props.value]) {
    return props.column.tagMap[props.value].type || 'info'
  }
  return props.column.tagType || 'info'
})

const tagEffect = computed(() => {
  return props.column.tagEffect || 'light'
})

const displayText = computed(() => {
  if (props.column.tagMap && props.column.tagMap[props.value]) {
    return props.column.tagMap[props.value].text || props.value
  }
  return props.value || '--'
})
</script>

<style scoped>
.column-tag {
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 12px;
  border: none;
}
</style>