# AutoComplete 自动完成

## 示例

<ClientOnly>
  <AutoCompleteDemo />
</ClientOnly>

## API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值 | `string \| number` | `''` |
| fetchSuggestions | 获取建议 | `(query, cb) => void` | - |
| placeholder | 占位符 | `string` | `''` |
| debounce | 防抖延迟(ms) | `number` | `300` |
| disabled | 禁用 | `boolean` | `false` |
| size | 尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |

## 事件

| 事件 | 说明 |
|------|------|
| select | 选中建议项 |
