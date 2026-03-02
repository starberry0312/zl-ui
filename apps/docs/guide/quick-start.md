# 快速上手

让新用户在最短时间内完成首次成功使用。

## 安装

```bash
pnpm add zl-ui
# 或
npm install zl-ui
```

## 引入

```ts
// main.ts
import { createApp } from 'vue'
import ZlUi from 'zl-ui'
import '@zl-ui/theme'
import App from './App.vue'

const app = createApp(App)
app.use(ZlUi)
app.mount('#app')
```

## 最小示例

```vue
<template>
  <ZlButton type="primary">点击</ZlButton>
</template>
```

## 按需引入

```ts
// 只引入 Button
import ZlButton from 'zl-ui/button'
app.component('ZlButton', ZlButton)

// 或命名导入（Tree-shaking）
import { ZlButton } from 'zl-ui'
```
