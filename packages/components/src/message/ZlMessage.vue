<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { useEventListener } from '@vueuse/core'
import type { MessageType, MessagePlacement } from './types'
import {
  MESSAGE_DEFAULT_PLACEMENT,
  getLastOffset,
  getOffsetOrSpace,
} from './instance'

defineOptions({
  name: 'ZlMessage',
})

const props = withDefaults(
  defineProps<{
    id?: string
    message?: string
    type?: MessageType
    duration?: number
    showClose?: boolean
    plain?: boolean
    offset?: number
    placement?: MessagePlacement
    dangerouslyUseHTMLString?: boolean
    customClass?: string
  repeatNum?: number
  repeatState?: { repeatNum: number }
  grouping?: boolean
  onClose?: () => void
  onDestroy?: () => void
  }>(),
  {
    id: '',
    message: '',
    type: 'info',
    duration: 3000,
    showClose: false,
    plain: false,
    offset: 16,
    placement: undefined,
    dangerouslyUseHTMLString: false,
    customClass: '',
    repeatNum: 1,
    repeatState: undefined,
    grouping: false,
  }
)

const emit = defineEmits<{
  close: []
  destroy: []
}>()

// 声明式用法：v-model:visible；命令式用法：有 id 时内部管理 visible
const modelVisible = defineModel<boolean>('visible', { default: false })
const internalVisible = ref(true)
const isImperative = computed(() => !!props.id)
const visible = computed({
  get: () => (isImperative.value ? internalVisible.value : modelVisible.value),
  set: (v: boolean) => {
    if (isImperative.value) internalVisible.value = v
    else modelVisible.value = v
  },
})

const displayRepeatNum = computed(() => props.repeatState?.repeatNum ?? props.repeatNum)

const placement = computed(
  () => props.placement ?? MESSAGE_DEFAULT_PLACEMENT
)

const verticalProperty = computed(() =>
  placement.value.startsWith('top') ? 'top' : 'bottom'
)

const horizontalClass = computed(() => {
  if (placement.value.includes('left')) return 'zl-message--left'
  if (placement.value.includes('right')) return 'zl-message--right'
  return 'zl-message--center'
})

const messageRef = ref<HTMLElement>()
const height = ref(0)

const lastOffset = computed(() =>
  props.id ? getLastOffset(props.id, placement.value) : 0
)

const offsetValue = computed(() => {
  if (!props.id) return props.offset
  return (
    getOffsetOrSpace(props.id, props.offset, placement.value) + lastOffset.value
  )
})

const customStyle = computed(() => ({
  [verticalProperty.value]: `${offsetValue.value}px`,
  zIndex: 9999,
}))

let stopTimer: (() => void) | undefined

function startTimer() {
  if (props.duration === 0) return
  const { stop } = useTimeoutFn(() => {
    close()
  }, props.duration)
  stopTimer = stop
}

function clearTimer() {
  stopTimer?.()
}

function close() {
  if (isImperative.value) {
    internalVisible.value = false
  } else {
    modelVisible.value = false
  }
  props.onClose?.()
  emit('close')
}

function afterLeave() {
  props.onDestroy?.()
  emit('destroy')
}

function keydown(e: KeyboardEvent) {
  if (e.code === 'Escape') close()
}

useEventListener(typeof document !== 'undefined' ? document : null, 'keydown', keydown)

watch(
  displayRepeatNum,
  () => {
    clearTimer()
    startTimer()
  }
)

// 声明式用法：visible 变为 true 时启动定时器
watch(visible, (v) => {
  if (v) {
    clearTimer()
    startTimer()
  }
})

onMounted(() => {
  if (messageRef.value) {
    height.value = messageRef.value.offsetHeight
  }
})

defineExpose({
  close,
})
</script>

<template>
  <Teleport to="body">
  <Transition name="zl-message-fade" @after-leave="afterLeave">
    <div
      v-show="visible"
      :id="id"
      ref="messageRef"
      role="alert"
      class="zl-message"
      :class="[
        `zl-message--${type}`,
        horizontalClass,
        {
          'zl-message--plain': plain,
          'zl-message--closable': showClose,
          'zl-message--bottom': verticalProperty === 'bottom',
        },
        customClass,
      ]"
      :style="customStyle"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <span v-if="displayRepeatNum > 1" class="zl-message__badge">{{ displayRepeatNum }}</span>
      <p v-if="!dangerouslyUseHTMLString" class="zl-message__content">
        {{ message }}
      </p>
      <p
        v-else
        class="zl-message__content"
        v-html="message"
      />
      <span
        v-if="showClose"
        class="zl-message__closeBtn"
        role="button"
        tabindex="0"
        aria-label="关闭"
        @click.stop="close"
        @keydown.enter="close"
      >
        ×
      </span>
    </div>
  </Transition>
  </Teleport>
</template>

<style scoped>
.zl-message {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 16px;
  min-width: 200px;
  box-sizing: border-box;
  border-radius: var(--zl-border-radius-base, 4px);
  border: 1px solid var(--zl-border-color-lighter, #ebeef5);
  background-color: var(--zl-fill-color, #f5f7fa);
  box-shadow: var(--zl-box-shadow-base, 0 2px 12px rgba(0, 0, 0, 0.1));
  font-size: var(--zl-font-size-base, 14px);
  transition: opacity 0.3s, top 0.4s, bottom 0.4s;
}

.zl-message--left {
  left: 20px;
  transform: none;
}

.zl-message--right {
  right: 20px;
  left: auto;
  transform: none;
}

.zl-message--center {
  left: 50%;
  transform: translateX(-50%);
}

.zl-message--bottom {
  top: auto;
}

.zl-message--primary {
  background-color: var(--zl-color-primary-light, #ecf5ff);
  border-color: var(--zl-color-primary-border, #c6e2ff);
  color: var(--zl-color-primary, #409eff);
}

.zl-message--success {
  background-color: var(--zl-color-success-bg, #f0f9eb);
  border-color: var(--zl-color-success-border, #e1f3d8);
  color: var(--zl-color-success, #67c23a);
}

.zl-message--warning {
  background-color: var(--zl-color-warning-bg, #fdf6ec);
  border-color: var(--zl-color-warning-border, #faecd8);
  color: var(--zl-color-warning, #e6a23c);
}

.zl-message--info {
  background-color: var(--zl-color-info-bg, #f4f4f5);
  border-color: var(--zl-color-info-border, #e9e9eb);
  color: var(--zl-color-info, #909399);
}

.zl-message--error {
  background-color: var(--zl-color-danger-bg, #fef0f0);
  border-color: var(--zl-color-danger-border, #fde2e2);
  color: var(--zl-color-danger, #f56c6c);
}

.zl-message--plain {
  background-color: var(--zl-background-color, #fff);
  box-shadow: none;
}

.zl-message--plain.zl-message--primary {
  border-color: var(--zl-color-primary-border);
}

.zl-message--plain.zl-message--success {
  border-color: var(--zl-color-success-border);
}

.zl-message--plain.zl-message--warning {
  border-color: var(--zl-color-warning-border);
}

.zl-message--plain.zl-message--info {
  border-color: var(--zl-color-info-border);
}

.zl-message--plain.zl-message--error {
  border-color: var(--zl-color-danger-border);
}

.zl-message__content {
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

.zl-message__badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #fff;
  background-color: var(--zl-color-danger, #f56c6c);
  border-radius: 9px;
}

.zl-message--success .zl-message__badge {
  background-color: var(--zl-color-success);
}

.zl-message--warning .zl-message__badge {
  background-color: var(--zl-color-warning);
}

.zl-message--info .zl-message__badge {
  background-color: var(--zl-color-info);
}

.zl-message__closeBtn {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--zl-color-info, #909399);
  font-size: 18px;
  line-height: 1;
  padding: 0 4px;
}

.zl-message__closeBtn:hover {
  color: var(--zl-color-primary, #409eff);
}

.zl-message-fade-enter-active,
.zl-message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.zl-message-fade-enter-from,
.zl-message-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.zl-message--left.zl-message-fade-enter-from,
.zl-message--left.zl-message-fade-leave-to,
.zl-message--right.zl-message-fade-enter-from,
.zl-message--right.zl-message-fade-leave-to {
  transform: translateY(-10px);
}
</style>
