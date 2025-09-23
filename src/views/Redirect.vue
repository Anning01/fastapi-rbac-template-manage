<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const targetPath = route.params.path
  if (targetPath) {
    router.replace('/' + targetPath)
  } else {
    router.replace('/dashboard')
  }
})
</script>