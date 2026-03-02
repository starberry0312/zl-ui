# zl-ui 架构说明

本文档与项目工程形态保持一致。

## 工程形态：Monorepo

组件库采用 **Monorepo** 架构，将工程拆分为职责清晰的包，便于独立开发和统一发布。

```
zl-ui-monorepo/
├── packages/
│   ├── utils/        # 工具包：与组件无关的通用逻辑
│   ├── theme/        # 主题包：样式变量与主题能力
│   ├── components/   # 组件包：具体 UI 组件实现
│   └── zl-ui/        # 主入口包：聚合 components、utils、theme
└── apps/
    └── docs/         # 文档与示例：用于展示和验证组件能力
```

## 包结构与职责

| 包名 | 职责 | 依赖关系 |
|------|------|----------|
| `@zl-ui/utils` | 防抖、escapeRegex 等通用工具 | 无（不依赖组件） |
| `@zl-ui/theme` | CSS 变量、主题样式 | 无 |
| `@zl-ui/components` | Button、Message、Upload、AutoComplete | utils、theme |
| `zl-ui` | 统一安装入口，提供 `app.use(ZlUi)` | components、utils、theme |
| `zl-ui-docs` | 文档站点，组件示例 | zl-ui、theme |

## 样式体系

- **theme 包**：`vars.css` 语义化变量，`light.css` / `dark.css` 主题
- **组件**：只使用 `var(--zl-*)`，不硬编码颜色
- **主题切换**：`document.documentElement.classList.toggle('zl-theme-dark')`，详见 `docs/STYLE-SYSTEM.md`

## 单元测试

- **Vitest + Vue Test Utils**：组件行为测试，保障对外 API 稳定
- **行为测试**：验证 Props、交互、边界输入，不测内部实现，详见 `docs/TESTING.md`

## 构建与按需引入

- **多入口**：components 包多入口构建，产出 index.js、button.js 等独立文件
- **exports**：package.json 暴露组件级路径 `./button`、`./message` 等
- **Tree-shaking**：命名导出 + sideEffects + ESM，详见 `docs/BUILD-AND-TREE-SHAKING.md`

**依赖原则**：组件依赖工具和样式，工具和样式不依赖组件。单向依赖，避免循环引用。

## 技术选型

- **Vue 3**：Composition API，便于逻辑拆分
- **TypeScript**：约束 Props、Emits，提升类型安全
- **Vite**：快速启动，良好的开发调试体验

## 开发与构建

```bash
# 安装依赖
pnpm install

# 开发（文档站点直接引用源码，无需预构建）
pnpm dev

# 构建所有包
pnpm run build:libs

# 构建文档
pnpm run build:docs
```
