<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()

onMounted(() => {
  // 应用启动时初始化菜单
  menuStore.fetchMenus()
})
</script>

<style>
/* 全局样式已在 main.css 中定义 */
</style>
