<script setup lang="ts">
import { Message } from 'zl-ui'

function show(t: string, type: 'success' | 'warning' | 'error' | 'info' | 'primary') {
  Message({ message: t, type })
}
</script>

<template>
  <div class="demo-block">
    <h4>函数式调用（不同类型）</h4>
    <ZlButton type="success" @click="show('操作成功', 'success')">成功</ZlButton>
    <ZlButton type="warning" @click="show('请注意', 'warning')">警告</ZlButton>
    <ZlButton type="danger" @click="show('操作失败', 'error')">错误</ZlButton>
    <ZlButton type="info" @click="show('提示信息', 'info')">信息</ZlButton>
    <ZlButton type="primary" @click="show('主要信息', 'primary')">主要</ZlButton>
  </div>
</template>
