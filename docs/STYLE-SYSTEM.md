# zl-ui 样式体系与主题定制

本文档说明样式包的设计与使用方式。

## 设计原则

- **样式与组件解耦**：组件只引用语义化变量，不硬编码颜色/尺寸
- **主题切换是样式行为**：切换主题只需加载/替换主题文件，无需重新构建
- **明确边界**：样式包不依赖任何组件，组件依赖样式包

## 包结构

```
packages/theme/
├── vars.css    # 语义化设计变量（默认值）
├── light.css   # 浅色主题
├── dark.css    # 深色主题
└── index.css   # 默认导出 light
```

## 使用方式

### 1. 引入主题

```ts
// main.ts
import '@zl-ui/theme'              // 浅色（默认）
import '@zl-ui/theme/dark.css'     // 深色变量（用于切换）
```

### 2. 切换主题

```ts
// 切换到深色
document.documentElement.classList.add('zl-theme-dark')

// 切换到浅色
document.documentElement.classList.remove('zl-theme-dark')
```

### 3. 变量列表（vars.css）

| 变量名 | 语义 |
|--------|------|
| `--zl-color-primary` | 主色 |
| `--zl-color-primary-hover` | 主色悬停 |
| `--zl-color-success` | 成功色 |
| `--zl-color-warning` | 警告色 |
| `--zl-color-danger` | 危险色 |
| `--zl-text-color-*` | 文本色 |
| `--zl-border-color-*` | 边框色 |
| `--zl-fill-color` | 填充色 |
| `--zl-background-color` | 背景色 |
| `--zl-disabled-opacity` | 禁用透明度 |

## 组件对接规范

组件样式只使用 `var(--zl-*)`，不写死颜色或尺寸。状态变化通过 class 切换，例如 `.is-disabled`。
