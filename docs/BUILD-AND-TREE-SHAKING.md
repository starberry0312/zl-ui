# 构建方式与按需引入

## 设计目标

- 用多少引多少，避免全量打包
- 支持 Tree-shaking
- 组件级路径引入

## 实现方式

### 1. Library 模式

使用 Vite `build.lib` 而非应用模式构建，输出可被其他项目消费的标准模块。

### 2. 多入口

每个组件独立入口，构建产出独立文件：

```
dist/
├── index.js        # 总入口，re-export 各组件
├── button.js       # 单组件入口
├── message.js
├── upload.js
├── autocomplete.js
└── chunks/         # 组件实现
```

### 3. package.json exports

```json
{
  "sideEffects": false,
  "exports": {
    ".": { "import": "./dist/index.js" },
    "./button": { "import": "./dist/button.js" },
    "./message": { "import": "./dist/message.js" },
    ...
  }
}
```

### 4. 命名导出

主入口使用 `export { ZlButton } from './button'`，**禁止** `export default { Button, Modal }` 聚合对象，否则无法 Tree-shake。

## 使用方式

```ts
// 方式一：命名导入（Tree-shaking 生效）
import { ZlButton } from '@zl-ui/components'

// 方式二：组件路径引入（只加载该组件）
import ZlButton from '@zl-ui/components/button'

// 方式三：通过 zl-ui 主包
import { ZlButton } from 'zl-ui'
import ZlButton from 'zl-ui/button'
```

## 生效条件

1. **ESM**：必须使用 `import/export`
2. **sideEffects**：`["**/*.css"]` 声明仅 CSS 有副作用，JS 可被 Tree-shake
3. **命名导入**：`import { ZlButton }`，而非 `import UI from 'zl-ui'; UI.Button`
