<script setup lang="ts">
import { ref } from 'vue'

interface UploadFile {
  uid: string
  name: string
  size: number
  status: string
  percentage?: number
  url?: string
}

const fileList = ref<UploadFile[]>([])

function onSuccess() {
  // 可选：提示
}
</script>

<template>
  <div class="demo-block">
    <ZlUpload v-model:file-list="fileList" @success="onSuccess" />
  </div>
  <div class="demo-block">
    <h4>拖拽上传</h4>
    <ZlUpload v-model:file-list="fileList" drag @success="onSuccess" />
  </div>
</template>
