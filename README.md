# FastAPI RBAC 后台管理系统

基于 Vue 3 + Element Plus + Pinia 构建的现代化RBAC后台管理系统，配套 [FastAPI RBAC Template](https://github.com/Anning01/fastapi-rbac-template) 使用。

## ✨ 特性

- 🎨 **现代化设计** - 采用 Element Plus UI框架，简洁美观的管理界面
- 🚀 **动态路由** - 支持基于菜单配置的动态路由生成
- 🎯 **组件化开发** - 内置通用组件（DataTable、DynamicForm、SearchForm）
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🔐 **RBAC权限管理** - 完整的用户、角色、权限管理体系
- 📊 **数据表格** - 支持搜索、分页、排序的通用数据表格组件
- 📝 **动态表单** - 支持多种字段类型的配置化表单组件
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
├── api/              # API接口封装
│   └── index.js      # 基于OpenAPI规范的接口定义
├── assets/           # 静态资源
│   └── styles/       # 全局样式
├── components/       # 通用组件
│   ├── AdminBreadcrumb.vue  # 面包屑组件
│   ├── AdminSkeleton.vue    # 骨架屏组件
│   ├── DataTable.vue        # 通用数据表格组件
│   ├── DynamicForm.vue      # 动态表单组件
│   └── SearchForm.vue       # 搜索表单组件
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
│   └── request.js    # HTTP请求封装
├── views/            # 页面组件
│   ├── users/        # 用户管理页面
│   │   ├── UserList.vue        # 用户列表
│   │   ├── RoleList.vue        # 角色管理
│   │   └── PermissionList.vue  # 权限管理
│   ├── dashboard.vue # 仪表盘
│   ├── Login.vue     # 登录页
│   ├── NotFound.vue  # 404页面
│   └── Redirect.vue  # 重定向页面
├── App.vue           # 根组件
└── main.js           # 入口文件
```

## 🔐 RBAC权限管理

系统实现了完整的角色权限控制体系：

### 核心功能

- **用户管理**: 用户列表、创建用户、编辑用户信息、角色分配
- **角色管理**: 角色创建、编辑、权限分配、角色删除
- **权限管理**: 权限创建、编辑、基于资源和操作的权限分类

### 权限模型

```
User (用户) -> Role (角色) -> Permission (权限)
```

权限格式: `资源:操作` (例如: `user:read`, `role:create`)

### 通用组件

#### DataTable 数据表格
支持搜索、分页、排序、行操作的通用表格组件

```vue
<DataTable
  :data="tableData"
  :columns="columns"
  :loading="loading"
  :pagination="pagination"
  :search-fields="searchFields"
  :left-actions="leftActions"
  :row-actions="rowActions"
  @search="handleSearch"
  @action="handleAction"
/>
```

#### DynamicForm 动态表单
支持多种字段类型的配置化表单组件

```vue
<DynamicForm
  v-model="formData"
  :fields="formFields"
  :submit-loading="submitLoading"
  @submit="handleSubmit"
/>
```

支持字段类型：
- `input`: 文本输入
- `textarea`: 文本域
- `password`: 密码输入
- `number`: 数字输入
- `select`: 选择器
- `radio`: 单选框
- `checkbox`: 复选框
- `switch`: 开关
- `date`: 日期选择
- `upload`: 文件上传

## 🎯 菜单配置

### 当前菜单结构

```json
[
  {
    "id": 1,
    "title": "仪表盘",
    "icon": "House",
    "path": "/dashboard",
    "component": "dashboard"
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
        "component": "users/UserList"
      },
      {
        "id": 22,
        "title": "角色管理",
        "icon": "Avatar",
        "path": "/users/roles",
        "component": "users/RoleList"
      },
      {
        "id": 23,
        "title": "权限管理",
        "icon": "Key",
        "path": "/users/permissions",
        "component": "users/PermissionList"
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
2. 在 `src/stores/menu.js` 的 `defaultMenus` 数组中添加菜单配置
3. 系统会自动生成对应的路由

### API接口

项目基于OpenAPI 3.1.0规范实现了完整的RBAC API：

- **用户接口**: 用户CRUD、激活/禁用
- **角色接口**: 角色CRUD、权限分配
- **权限接口**: 权限CRUD
- **用户角色关联**: 角色分配、权限查询

所有接口已在 `src/api/index.js` 中定义，支持：
- 自动token管理
- 请求/响应拦截
- 错误处理
- 自动重试

### 通用组件使用

#### DataTable 配置示例

```javascript
const columns = [
  { prop: 'id', label: 'ID', width: '80', sortable: true },
  { prop: 'username', label: '用户名', minWidth: '120' },
  { prop: 'is_active', label: '状态', type: 'switch' },
  { prop: 'created_at', label: '创建时间', type: 'date' }
]

const searchFields = [
  { prop: 'search', label: '关键词', type: 'input' },
  { prop: 'is_active', label: '状态', type: 'select', options: [...] }
]
```

#### DynamicForm 配置示例

```javascript
const formFields = [
  { prop: 'username', label: '用户名', type: 'input', required: true },
  { prop: 'password', label: '密码', type: 'password', required: true },
  { prop: 'is_active', label: '启用', type: 'switch', defaultValue: true }
]
```

## 🤝 配套项目

- 后端 API: [FastAPI RBAC Template](https://github.com/Anning01/fastapi-rbac-template)

## 📄 许可证

[MIT License](LICENSE)
