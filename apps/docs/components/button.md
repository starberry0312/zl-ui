# Button 按钮

## 示例

<ClientOnly>
  <div class="demo-block">
    <ZlButton>默认</ZlButton>
    <ZlButton type="primary">主要</ZlButton>
    <ZlButton type="success">成功</ZlButton>
    <ZlButton type="warning">警告</ZlButton>
    <ZlButton type="danger">危险</ZlButton>
    <ZlButton type="info">信息</ZlButton>
  </div>
  <div class="demo-block">
    <ZlButton plain>朴素</ZlButton>
    <ZlButton type="primary" plain>主要</ZlButton>
    <ZlButton type="success" plain>成功</ZlButton>
    <ZlButton type="warning" plain>警告</ZlButton>
    <ZlButton type="danger" plain>危险</ZlButton>
    <ZlButton type="info" plain>信息</ZlButton>
  </div>
  <div class="demo-block">
    <ZlButton type="primary" round>圆角</ZlButton>
  </div>
  <div class="demo-block">
    <ZlButton size="large">大</ZlButton>
    <ZlButton>默认</ZlButton>
    <ZlButton size="small">小</ZlButton>
  </div>
</ClientOnly>

## API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| type | 类型 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'default'` |
| size | 尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| plain | 朴素按钮 | `boolean` | `false` |
| round | 圆角 | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
