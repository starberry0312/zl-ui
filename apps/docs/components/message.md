# Message 消息提示

Message 是全局提示组件，支持多种类型、位置、自动关闭等。提供**组件用法**与**函数式用法**两种方式。

## 基础用法

### 函数式调用（推荐）

通过 `Message()` 创建消息实例，无需在模板中声明：

<ClientOnly>
  <MessageDemo />
</ClientOnly>

### 组件用法

在模板中使用 `ZlMessage`，通过 `v-model:visible` 控制显示：

```vue
<template>
  <ZlButton @click="visible = true">显示消息</ZlButton>
  <ZlMessage v-model:visible="visible" message="操作成功" type="success" />
</template>
<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## 不同类型

支持 `primary`、`success`、`info`、`warning`、`error` 五种类型，通过 `type` 控制：

```ts
Message({ message: '操作成功', type: 'success' })
Message({ message: '请注意', type: 'warning' })
Message({ message: '操作失败', type: 'error' })
Message({ message: '提示信息', type: 'info' })
Message({ message: '主要信息', type: 'primary' })
```

## 位置

通过 `placement` 控制显示位置：

- `top`、`top-left`、`top-right`
- `bottom`、`bottom-left`、`bottom-right`

```ts
Message({ message: '右上角', placement: 'top-right' })
Message({ message: '底部居中', placement: 'bottom' })
```

## 关闭行为

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| duration | 自动关闭时长（ms），0 表示不自动关闭 | `number` | `3000` |
| showClose | 是否显示关闭按钮 | `boolean` | `false` |

- 鼠标悬停时会暂停倒计时，离开后重新计时
- 按 `ESC` 键可关闭当前消息

```ts
Message({ message: '5秒后关闭', duration: 5000 })
Message({ message: '需手动关闭', duration: 0, showClose: true })
```

## 其他

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| message | 消息内容 | `string` | `''` |
| type | 类型 | `MessageType` | `'info'` |
| plain | 朴素模式（白底、无阴影） | `boolean` | `false` |
| offset | 与视口的偏移量 | `number` | `16` |
| grouping | 相同内容合并显示重复次数 | `boolean` | `false` |
| dangerouslyUseHTMLString | 是否将内容当作 HTML 渲染（⚠️ 存在 XSS 风险） | `boolean` | `false` |
| onClose | 关闭时回调 | `() => void` | - |
| appendTo | 挂载的 DOM 节点 | `HTMLElement \| string` | `body` |

### 返回值

`Message()` 返回 `MessageHandler`，可调用 `close()` 手动关闭：

```ts
const handler = Message({ message: '可手动关闭', duration: 0 })
handler.close()
```

### 关闭所有

```ts
Message.closeAll()           // 关闭所有
Message.closeAll('top')      // 关闭指定位置
```
