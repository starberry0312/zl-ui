# Upload 上传

## 示例

<ClientOnly>
  <UploadDemo />
</ClientOnly>

## API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| fileList | 文件列表（v-model） | `UploadFile[]` | `[]` |
| listType | 列表类型 | `'text' \| 'picture' \| 'picture-card'` | `'text'` |
| drag | 是否拖拽 | `boolean` | `false` |
| limit | 最大文件数 | `number` | `Infinity` |
| fileSize | 单文件大小限制(KB) | `number` | `Infinity` |
| accept | 接受的文件类型 | `string` | `'*'` |
| autoUpload | 是否自动上传 | `boolean` | `true` |

## 事件

| 事件 | 说明 |
|------|------|
| change | 文件变化 |
| success | 上传成功 |
| error | 上传失败 |
| exceed | 超出限制 |
