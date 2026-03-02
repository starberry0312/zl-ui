# zl-ui

基于 Vue 3 + TypeScript 的组件库，采用 Monorepo 架构。

## 项目结构

```
.
├── apps/docs/          # 文档站点（VitePress）
├── packages/
│   ├── components/     # 组件源码
│   ├── utils/          # 工具函数
│   └── zl-ui/          # 聚合包（构建产物）
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动文档站点（含组件示例与 Playground）
pnpm dev
```

文档站点默认运行在 http://localhost:5173/（端口占用时会自动递增）。

## 构建

```bash
# 构建组件库
pnpm run build:libs

# 构建组件库 + 文档站点
pnpm run build:docs
```

## 文档

文档是组件库的重要组成部分，包含：

- **快速上手**：安装、引入、最小可用示例
- **API 文档**：Props、事件、默认行为与边界说明
- **示例**：可运行的组件示例，支持在线修改与复现

运行 `pnpm dev` 后访问文档站点即可查看。

## 测试

```bash
pnpm test
```
