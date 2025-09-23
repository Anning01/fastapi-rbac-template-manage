<template>
  <div class="menu-manager">
    <div class="page-header">
      <h2>动态菜单管理</h2>
      <div class="header-actions">
        <el-button @click="resetToDefault">重置为默认</el-button>
        <el-button type="primary" @click="showJsonEditor = true">
          <el-icon><Edit /></el-icon>
          编辑菜单JSON
        </el-button>
      </div>
    </div>

    <!-- 当前菜单预览 -->
    <div class="menu-preview card">
      <h3>当前菜单结构</h3>
      <el-tree
        :data="menuList"
        :props="treeProps"
        default-expand-all
        class="menu-tree"
      >
        <template #default="{ node, data }">
          <div class="tree-node">
            <el-icon v-if="data.icon">
              <component :is="data.icon" />
            </el-icon>
            <span class="node-label">{{ data.title }}</span>
            <el-tag v-if="data.path" size="small" type="info">{{ data.path }}</el-tag>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- JSON编辑器对话框 -->
    <el-dialog
      v-model="showJsonEditor"
      title="编辑菜单JSON"
      width="80%"
      :before-close="handleClose"
    >
      <div class="json-editor">
        <el-input
          v-model="jsonContent"
          type="textarea"
          :rows="20"
          placeholder="请输入菜单JSON配置"
          class="json-textarea"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showJsonEditor = false">取消</el-button>
          <el-button @click="validateJson">验证JSON</el-button>
          <el-button type="primary" @click="applyJsonMenu">应用配置</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 示例JSON -->
    <div class="example-section card">
      <h3>示例菜单配置</h3>
      <p class="example-desc">
        您可以参考以下JSON格式来配置菜单。支持多级嵌套，图标使用Element Plus图标名称。
      </p>
      <el-button @click="loadExample" type="text">加载示例到编辑器</el-button>
      <pre class="example-json">{{ exampleJson }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { ElMessage, ElMessageBox } from 'element-plus'

const menuStore = useMenuStore()
const showJsonEditor = ref(false)
const jsonContent = ref('')

const menuList = computed(() => menuStore.menuList)

const treeProps = {
  children: 'children',
  label: 'title'
}

const exampleJson = `[
  {
    "id": 1,
    "title": "仪表盘",
    "icon": "House",
    "path": "/dashboard",
    "component": "Dashboard",
    "meta": {
      "title": "仪表盘",
      "icon": "House",
      "keepAlive": true
    }
  },
  {
    "id": 2,
    "title": "自定义模块",
    "icon": "Grid",
    "path": "/custom",
    "children": [
      {
        "id": 21,
        "title": "功能A",
        "icon": "Star",
        "path": "/custom/feature-a",
        "component": "custom/FeatureA",
        "meta": {
          "title": "功能A",
          "icon": "Star"
        }
      },
      {
        "id": 22,
        "title": "功能B",
        "icon": "Trophy",
        "path": "/custom/feature-b",
        "component": "custom/FeatureB",
        "meta": {
          "title": "功能B",
          "icon": "Trophy"
        }
      }
    ]
  }
]`

const resetToDefault = () => {
  ElMessageBox.confirm('确认重置为默认菜单配置？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    menuStore.resetToDefaultMenus()
    ElMessage.success('已重置为默认菜单')
  })
}

const loadExample = () => {
  jsonContent.value = exampleJson
  showJsonEditor.value = true
}

const validateJson = () => {
  try {
    JSON.parse(jsonContent.value)
    ElMessage.success('JSON格式正确')
  } catch (error) {
    ElMessage.error('JSON格式错误: ' + error.message)
  }
}

const applyJsonMenu = () => {
  try {
    const success = menuStore.setMenuFromJson(jsonContent.value)
    if (success) {
      showJsonEditor.value = false
      ElMessage.success('菜单配置已更新，请刷新页面查看效果')

      // 提示用户刷新页面
      setTimeout(() => {
        ElMessageBox.confirm('菜单已更新，是否刷新页面查看新菜单？', '提示', {
          confirmButtonText: '刷新',
          cancelButtonText: '稍后',
          type: 'info'
        }).then(() => {
          window.location.reload()
        })
      }, 1000)
    } else {
      ElMessage.error('菜单配置格式错误')
    }
  } catch (error) {
    ElMessage.error('应用配置失败: ' + error.message)
  }
}

const handleClose = (done) => {
  ElMessageBox.confirm('关闭编辑器？未保存的更改将丢失', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    done()
  }).catch(() => {})
}

onMounted(() => {
  // 初始化JSON内容为当前菜单
  jsonContent.value = JSON.stringify(menuList.value, null, 2)
})
</script>

<style scoped>
.menu-manager {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.menu-preview {
  padding: 24px;
}

.menu-preview h3 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
}

.menu-tree {
  background: transparent;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.node-label {
  font-weight: 500;
}

.json-editor {
  margin-bottom: 16px;
}

.json-textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.json-textarea :deep(.el-textarea__inner) {
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
}

.example-section {
  padding: 24px;
}

.example-section h3 {
  margin: 0 0 12px 0;
  color: var(--text-primary);
}

.example-desc {
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
}

.example-json {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  color: var(--text-primary);
}
</style>