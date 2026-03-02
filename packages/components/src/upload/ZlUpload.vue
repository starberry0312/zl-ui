<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { genFileId } from '@zl-ui/utils'
import type { UploadFile, UploadListType } from './types'
import { uploadListTypes } from './types'

defineOptions({
  name: 'ZlUpload',
})

const props = withDefaults(
  defineProps<{
    action?: string
    disabled?: boolean
    accept?: string
    multiple?: boolean
    listType?: UploadListType
    drag?: boolean
    limit?: number
    fileSize?: number
    autoUpload?: boolean
    showFileList?: boolean
  }>(),
  {
    action: '#',
    disabled: false,
    accept: '*',
    multiple: false,
    listType: 'text',
    drag: false,
    limit: Infinity,
    fileSize: Infinity,
    autoUpload: true,
    showFileList: true,
  },
)

const fileList = defineModel<UploadFile[]>('fileList', { default: () => [] })

const emit = defineEmits<{
  (e: 'change', file: UploadFile, fileList: UploadFile[]): void
  (e: 'success', file: UploadFile, fileList: UploadFile[]): void
  (e: 'error', file: UploadFile, fileList: UploadFile[]): void
  (e: 'exceed', files: File[], fileList: UploadFile[]): void
  (e: 'preview', file: UploadFile): void
}>()

const inputRef = ref<HTMLInputElement>()
const dragOver = ref(false)
const previewUrl = ref('')
const previewVisible = ref(false)

const isDisabled = computed(() => props.disabled)

const canAddFiles = computed(() => {
  const remaining = props.limit - fileList.value.length
  return remaining > 0
})

function createUploadFile(raw: File): UploadFile {
  const uid = genFileId()
  const url = raw.type.startsWith('image/') ? URL.createObjectURL(raw) : undefined
  return {
    uid,
    name: raw.name,
    size: raw.size,
    status: 'ready',
    url,
    raw,
  }
}

function checkFileType(file: File): boolean {
  if (props.accept === '*') return true
  const acceptList = props.accept.split(',').map((s) => s.trim().toLowerCase())
  const ext = '.' + (file.name.split('.').pop() || '').toLowerCase()
  const mime = file.type.toLowerCase()
  return acceptList.some((a) => a.startsWith('.') ? ext === a : mime === a)
}

function checkFileSize(file: File): boolean {
  if (props.fileSize === Infinity) return true
  return file.size <= props.fileSize * 1024
}

function handleStart(files: File[]) {
  if (!canAddFiles.value) {
    emit('exceed', files, [...fileList.value])
    return
  }
  const toAdd = props.multiple ? files : files.slice(0, 1)
  const remaining = props.limit - fileList.value.length
  const sliceLen = Math.min(toAdd.length, remaining)

  for (let i = 0; i < sliceLen; i++) {
    const file = toAdd[i]
    if (!checkFileType(file)) {
      const uf = createUploadFile(file)
      uf.status = 'error'
      fileList.value = [...fileList.value, uf]
      emit('change', uf, fileList.value)
      emit('error', uf, fileList.value)
      continue
    }
    if (!checkFileSize(file)) {
      const uf = createUploadFile(file)
      uf.status = 'error'
      fileList.value = [...fileList.value, uf]
      emit('change', uf, fileList.value)
      emit('error', uf, fileList.value)
      continue
    }

    const uf = createUploadFile(file)
    fileList.value = [...fileList.value, uf]
    emit('change', uf, fileList.value)

    if (props.autoUpload) {
      uploadFile(uf)
    }
  }

  if (sliceLen < toAdd.length && props.limit !== Infinity) {
    emit('exceed', toAdd.slice(sliceLen), fileList.value)
  }
}

function uploadFile(uploadFile: UploadFile) {
  const raw = uploadFile.raw
  if (!raw || props.action === '#') {
    uploadFile.status = 'success'
    uploadFile.percentage = 100
    emit('success', uploadFile, fileList.value)
    return
  }

  uploadFile.status = 'uploading'
  uploadFile.percentage = 0

  const xhr = new XMLHttpRequest()
  const formData = new FormData()
  formData.append('file', raw)

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      uploadFile.percentage = Math.round((e.loaded / e.total) * 100)
    }
  }

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      uploadFile.status = 'success'
      uploadFile.percentage = 100
      emit('success', uploadFile, fileList.value)
    } else {
      uploadFile.status = 'error'
      emit('error', uploadFile, fileList.value)
    }
  }

  xhr.onerror = () => {
    uploadFile.status = 'error'
    emit('error', uploadFile, fileList.value)
  }

  xhr.open('POST', props.action)
  xhr.send(formData)
}

function submit() {
  fileList.value
    .filter((f) => f.status === 'ready')
    .forEach((f) => uploadFile(f))
}

function handleClick() {
  if (isDisabled.value || !canAddFiles.value) return
  inputRef.value?.click()
}

function handleChange(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (files?.length) {
    handleStart(Array.from(files))
  }
  input.value = ''
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  dragOver.value = false
  if (isDisabled.value || !canAddFiles.value) return
  const files = e.dataTransfer?.files
  if (files?.length) {
    handleStart(Array.from(files))
  }
}

function handleDragover(e: DragEvent) {
  e.preventDefault()
  if (isDisabled.value) return
  dragOver.value = true
}

function handleDragleave() {
  dragOver.value = false
}

function handleRemove(file: UploadFile) {
  if (file.url) URL.revokeObjectURL(file.url)
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
}

function handlePreview(file: UploadFile) {
  if (file.url) {
    previewUrl.value = file.url
    previewVisible.value = true
    emit('preview', file)
  }
}

function closePreview() {
  previewVisible.value = false
}

defineExpose({
  submit,
})
</script>

<template>
  <div
    :class="[
      'zl-upload',
      `zl-upload--${listType}`,
      { 'zl-upload--drag': drag, 'is-drag-over': dragOver },
    ]"
  >
    <input
      ref="inputRef"
      type="file"
      class="zl-upload__input"
      :disabled="isDisabled"
      :accept="accept"
      :multiple="multiple"
      @change="handleChange"
    />

    <!-- 拖拽区域 -->
    <div
      v-if="drag"
      class="zl-upload-dragger"
      :class="{ 'is-disabled': isDisabled, 'is-drag-over': dragOver }"
      @click="handleClick"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragleave="handleDragleave"
    >
      <slot name="default">
        <span class="zl-upload__text">将文件拖到此处，或<em>点击上传</em></span>
      </slot>
    </div>

    <!-- 点击上传 -->
    <div v-else class="zl-upload__trigger" @click="handleClick">
      <slot name="trigger">
        <span class="zl-upload__text">点击上传</span>
      </slot>
    </div>

    <!-- 文件列表 -->
    <div v-if="showFileList && fileList.length" class="zl-upload-list" :class="`zl-upload-list--${listType}`">
      <template v-for="file in fileList" :key="file.uid">
        <!-- text 模式 -->
        <div v-if="listType === 'text'" class="zl-upload-list__item zl-upload-list__item--text">
          <span class="zl-upload-list__item-name">{{ file.name }}</span>
          <span class="zl-upload-list__item-status">
            <template v-if="file.status === 'uploading'">上传中 {{ file.percentage }}%</template>
            <template v-else-if="file.status === 'success'">成功</template>
            <template v-else-if="file.status === 'error'">失败</template>
            <template v-else>待上传</template>
          </span>
          <span v-if="file.status === 'uploading'" class="zl-upload-list__item-progress">
            <span class="zl-upload-list__item-progress-bar" :style="{ width: file.percentage + '%' }" />
          </span>
          <span class="zl-upload-list__item-actions">
            <span v-if="file.url" class="zl-upload-list__item-preview" @click.stop="handlePreview(file)">预览</span>
            <span class="zl-upload-list__item-delete" @click.stop="handleRemove(file)">删除</span>
          </span>
        </div>

        <!-- picture 模式 -->
        <div v-else-if="listType === 'picture'" class="zl-upload-list__item zl-upload-list__item--picture">
          <img v-if="file.url" :src="file.url" class="zl-upload-list__item-thumb" />
          <span v-else class="zl-upload-list__item-thumb-placeholder">无预览</span>
          <div class="zl-upload-list__item-info">
            <span class="zl-upload-list__item-name">{{ file.name }}</span>
            <span class="zl-upload-list__item-status">{{ file.status }}</span>
            <span class="zl-upload-list__item-actions">
              <span v-if="file.url" @click.stop="handlePreview(file)">预览</span>
              <span @click.stop="handleRemove(file)">删除</span>
            </span>
          </div>
        </div>

        <!-- picture-card 模式 -->
        <div v-else class="zl-upload-list__item zl-upload-list__item--picture-card">
          <img v-if="file.url" :src="file.url" class="zl-upload-list__item-thumb" @click="handlePreview(file)" />
          <span v-else class="zl-upload-list__item-thumb-placeholder">无预览</span>
          <span class="zl-upload-list__item-actions-overlay">
            <span v-if="file.url" @click.stop="handlePreview(file)">预览</span>
            <span @click.stop="handleRemove(file)">删除</span>
          </span>
        </div>
      </template>
    </div>

    <!-- 图片预览 -->
    <Teleport to="body">
      <Transition name="zl-upload-preview">
        <div
          v-if="previewVisible"
          class="zl-upload-preview"
          @click="closePreview"
        >
          <img :src="previewUrl" alt="预览" @click.stop />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.zl-upload {
  display: inline-block;
}
.zl-upload__input {
  display: none;
}
.zl-upload__trigger {
  cursor: pointer;
}
.zl-upload-dragger {
  padding: 40px;
  border: 1px dashed var(--zl-border-color);
  border-radius: 6px;
  background: var(--zl-fill-color);
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
}
.zl-upload-dragger:hover:not(.is-disabled),
.zl-upload-dragger.is-drag-over {
  border-color: var(--zl-color-primary);
  color: var(--zl-color-primary);
}
.zl-upload-dragger.is-disabled {
  opacity: var(--zl-disabled-opacity);
  cursor: not-allowed;
}
.zl-upload__text {
  font-size: var(--zl-font-size-base);
  color: var(--zl-text-color-regular);
}
.zl-upload__text em {
  color: var(--zl-color-primary);
  font-style: normal;
}

/* 文件列表 - text */
.zl-upload-list {
  margin-top: 8px;
}
.zl-upload-list__item--text {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: var(--zl-font-size-base);
  border-bottom: 1px solid var(--zl-border-color-lighter);
}
.zl-upload-list__item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.zl-upload-list__item-status {
  color: var(--zl-text-color-secondary);
  font-size: 12px;
}
.zl-upload-list__item-progress {
  width: 100px;
  height: 4px;
  background: var(--zl-border-color-light);
  border-radius: 2px;
  overflow: hidden;
}
.zl-upload-list__item-progress-bar {
  display: block;
  height: 100%;
  background: var(--zl-color-primary);
  transition: width 0.2s;
}
.zl-upload-list__item-actions span {
  margin-left: 8px;
  color: var(--zl-color-primary);
  cursor: pointer;
}

/* 文件列表 - picture */
.zl-upload-list__item--picture {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-right: 8px;
  margin-bottom: 8px;
  border: 1px solid var(--zl-border-color);
  border-radius: var(--zl-border-radius-base);
}
.zl-upload-list__item-thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: var(--zl-border-radius-base);
}
.zl-upload-list__item-thumb-placeholder {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zl-fill-color);
  border-radius: var(--zl-border-radius-base);
  font-size: 12px;
  color: var(--zl-text-color-secondary);
}
.zl-upload-list__item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.zl-upload-list__item-info .zl-upload-list__item-actions span {
  margin-right: 8px;
}

/* 文件列表 - picture-card */
.zl-upload-list--picture-card {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.zl-upload-list__item--picture-card {
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px dashed var(--zl-border-color);
  border-radius: 6px;
  overflow: hidden;
}
.zl-upload-list__item--picture-card .zl-upload-list__item-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.zl-upload-list__item--picture-card .zl-upload-list__item-thumb-placeholder {
  width: 100%;
  height: 100%;
}
.zl-upload-list__item-actions-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: var(--zl-font-size-base);
  opacity: 0;
  transition: opacity 0.2s;
}
.zl-upload-list__item--picture-card:hover .zl-upload-list__item-actions-overlay {
  opacity: 1;
}
.zl-upload-list__item-actions-overlay span {
  cursor: pointer;
}

/* 预览弹层 */
.zl-upload-preview {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}
.zl-upload-preview img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  cursor: default;
}
.zl-upload-preview-enter-active,
.zl-upload-preview-leave-active {
  transition: opacity 0.2s;
}
.zl-upload-preview-enter-from,
.zl-upload-preview-leave-to {
  opacity: 0;
}
</style>
