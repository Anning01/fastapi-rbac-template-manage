<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-icon">
        <el-icon size="120" color="#e5e7eb">
          <Warning />
        </el-icon>
      </div>
      <h1 class="error-title">404</h1>
      <p class="error-message">抱歉，您访问的页面不存在</p>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回上页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
}

.not-found-content {
  text-align: center;
  max-width: 400px;
  padding: 40px;
}

.error-title {
  font-size: 72px;
  font-weight: 700;
  color: var(--text-secondary);
  margin: 20px 0 16px;
}

.error-message {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>