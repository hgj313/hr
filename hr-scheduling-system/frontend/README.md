# HR调度系统前端

这是HR调度系统的React前端应用，使用Vite构建工具和Ant Design UI组件库。

## 功能特性

- 📊 仪表板 - 系统概览和统计信息
- 👥 员工管理 - 员工信息的增删改查
- 📋 项目管理 - 项目信息的增删改查
- ⚠️ 冲突检测 - 单员工和多员工时间冲突检测
- 📅 时间轴视图 - 员工、项目、部门时间轴可视化
- 📈 数据分析 - 各种统计图表和分析

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Ant Design** - UI组件库
- **React Router** - 路由管理
- **Axios** - HTTP客户端
- **Day.js** - 日期处理
- **Recharts** - 图表库

## 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

## 安装和运行

### 1. 安装Node.js

如果系统中没有安装Node.js，请先安装：

- 访问 [Node.js官网](https://nodejs.org/) 下载并安装最新LTS版本
- 或者使用包管理器安装：
  ```bash
  # Windows (使用Chocolatey)
  choco install nodejs
  
  # 或者使用Scoop
  scoop install nodejs
  ```

### 2. 安装依赖

```bash
cd frontend
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 4. 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist` 目录

## 项目结构

```
frontend/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── ConflictDisplay.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Loading.tsx
│   │   ├── TimelineChart.tsx
│   │   └── index.ts
│   ├── pages/              # 页面组件
│   │   ├── Analytics.tsx
│   │   ├── ConflictDetection.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EmployeeManagement.tsx
│   │   ├── ProjectManagement.tsx
│   │   ├── TimelineView.tsx
│   │   └── index.ts
│   ├── services/           # API服务
│   │   ├── algorithmService.ts
│   │   ├── api.ts
│   │   └── dataService.ts
│   ├── types/              # TypeScript类型定义
│   │   └── index.ts
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── package.json            # 项目配置
├── vite.config.ts          # Vite配置
└── tsconfig.json           # TypeScript配置
```

## API配置

前端应用通过代理连接到后端API：

- 开发环境：`http://localhost:3000/api` -> `http://localhost:8000/api`
- 后端API基础路径：`/api/v1`

确保后端服务在 `http://localhost:8000` 运行。

## 开发说明

### 添加新页面

1. 在 `src/pages/` 目录创建新的页面组件
2. 在 `src/pages/index.ts` 中导出新组件
3. 在 `src/App.tsx` 中添加路由配置

### 添加新组件

1. 在 `src/components/` 目录创建新组件
2. 在 `src/components/index.ts` 中导出新组件

### API服务

- `algorithmService.ts` - 算法相关API（冲突检测、时间轴等）
- `dataService.ts` - 基础数据API（员工、项目、任务等）
- `api.ts` - Axios配置和拦截器

## 故障排除

### 常见问题

1. **端口冲突**
   - 修改 `vite.config.ts` 中的端口配置
   
2. **API连接失败**
   - 确保后端服务正在运行
   - 检查代理配置是否正确

3. **依赖安装失败**
   - 清除缓存：`npm cache clean --force`
   - 删除 `node_modules` 和 `package-lock.json`，重新安装

### 开发工具

推荐使用以下VS Code扩展：

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint

## 许可证

MIT License