# FastAPI RBAC 后台管理系统

基于 Vue 3 + Element Plus + Pinia 构建的现代化后台管理系统，配套 [FastAPI RBAC Template](https://github.com/Anning01/fastapi-rbac-template) 使用。

## ✨ 特性

- 🎨 **现代化设计** - 采用 Element Plus + 自定义样式，借鉴 uiverse.io 设计风格
- 🚀 **动态路由** - 支持基于 JSON 配置的动态菜单和路由生成
- 🎯 **组件丰富** - 内置骨架屏、面包屑、布局等基础组件
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🔐 **权限管理** - 集成角色权限控制系统
- ⚡ **高性能** - 基于 Vite 构建，开发体验优秀

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
src/
├── assets/           # 静态资源
│   └── styles/       # 全局样式
├── components/       # 通用组件
│   ├── AdminBreadcrumb.vue  # 面包屑组件
│   └── AdminSkeleton.vue    # 骨架屏组件
├── layouts/          # 布局组件
│   ├── AdminLayout.vue      # 主布局
│   ├── AdminHeader.vue      # 头部组件
│   └── AdminSidebar.vue     # 侧边栏组件
├── stores/           # Pinia 状态管理
│   ├── counter.js    # 示例 store
│   └── menu.js       # 菜单管理 store
├── router/           # 路由配置
│   └── index.js      # 路由主文件
├── utils/            # 工具函数
├── views/            # 页面组件
│   ├── users/        # 用户管理页面
│   ├── system/       # 系统管理页面
│   ├── analytics/    # 数据分析页面
│   ├── Dashboard.vue # 仪表盘
│   ├── Login.vue     # 登录页
│   ├── NotFound.vue  # 404页面
│   └── Redirect.vue  # 重定向页面
├── App.vue           # 根组件
└── main.js           # 入口文件
```

## 🎯 动态菜单配置

系统支持通过 JSON 配置动态生成菜单和路由，进入 "系统管理 > 菜单管理" 可以：

- 查看当前菜单结构
- 编辑菜单 JSON 配置
- 实时预览菜单变化
- 重置为默认配置

### 菜单配置格式

```json
[
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
    "title": "用户管理",
    "icon": "User",
    "path": "/users",
    "children": [
      {
        "id": 21,
        "title": "用户列表",
        "icon": "UserFilled",
        "path": "/users/list",
        "component": "users/UserList",
        "meta": {
          "title": "用户列表",
          "icon": "UserFilled"
        }
      }
    ]
  }
]
```

### 字段说明

- `id`: 菜单唯一标识
- `title`: 菜单显示名称
- `icon`: Element Plus 图标名称
- `path`: 路由路径
- `component`: 对应的 Vue 组件路径（相对于 src/views/）
- `children`: 子菜单数组
- `meta`: 路由元信息

## 🎨 主题定制

项目使用 CSS 变量定义主题，可在 `src/assets/styles/main.css` 中修改：

```css
:root {
  --primary-color: #6366f1;
  --primary-light: #8b5cf6;
  --primary-dark: #4f46e5;
  /* 更多变量... */
}
```

## 🔧 开发说明

### 添加新页面

1. 在 `src/views/` 下创建 Vue 组件
2. 在菜单管理中添加对应的菜单配置
3. 系统会自动生成路由

### 使用骨架屏

```vue
<AdminSkeleton type="table" :row-count="10" :column-count="5" />
```

支持的类型：
- `mixed`: 混合布局（默认）
- `table`: 表格布局
- `card`: 卡片布局
- `form`: 表单布局

### 面包屑配置

面包屑会根据当前路由自动生成，也可以手动配置：

```vue
<AdminBreadcrumb
  :items="breadcrumbItems"
  :show-refresh="true"
  :show-fullscreen="true"
/>
```

## 🤝 配套项目

- 后端 API: [FastAPI RBAC Template](https://github.com/Anning01/fastapi-rbac-template)

## 📄 许可证

[MIT License](LICENSE)
