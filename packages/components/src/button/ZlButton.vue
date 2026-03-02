<script setup lang="ts">
defineOptions({
  name: 'ZlButton',
})

const props = withDefaults(
  defineProps<{
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
    size?: 'large' | 'default' | 'small'
    plain?: boolean
    round?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'default',
    size: 'default',
    plain: false,
    round: false,
    disabled: false,
  },
)
</script>

<template>
  <button
    type="button"
    class="zl-button"
    :class="[
      `zl-button--${props.type}`,
      `zl-button--${props.size}`,
      { 'zl-button--plain': props.plain, 'zl-button--round': props.round, 'is-disabled': props.disabled },
    ]"
    :disabled="props.disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.zl-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  font-size: var(--zl-font-size-base);
  line-height: 1.5;
  border-radius: var(--zl-border-radius-base);
  border: 1px solid var(--zl-border-color);
  background: var(--zl-background-color);
  color: var(--zl-text-color-regular);
  cursor: pointer;
  transition: 0.1s;
}
.zl-button:hover:not(.is-disabled) {
  color: var(--zl-color-primary);
  border-color: var(--zl-color-primary-border);
  background: var(--zl-color-primary-light);
}
.zl-button--primary {
  color: #fff;
  background: var(--zl-color-primary, #409eff);
  border-color: var(--zl-color-primary, #409eff);
}
.zl-button--primary:hover:not(.is-disabled) {
  background: var(--zl-color-primary-hover, #66b1ff);
  border-color: var(--zl-color-primary-hover, #66b1ff);
}
.zl-button--success { color: #fff; background: var(--zl-color-success, #67c23a); border-color: var(--zl-color-success, #67c23a); }
.zl-button--success:hover:not(.is-disabled) { background: var(--zl-color-success-hover, #85ce61); border-color: var(--zl-color-success-hover, #85ce61); }
.zl-button--warning { color: #fff; background: var(--zl-color-warning, #e6a23c); border-color: var(--zl-color-warning, #e6a23c); }
.zl-button--warning:hover:not(.is-disabled) { background: var(--zl-color-warning-hover, #ebb563); border-color: var(--zl-color-warning-hover, #ebb563); }
.zl-button--danger { color: #fff; background: var(--zl-color-danger, #f56c6c); border-color: var(--zl-color-danger, #f56c6c); }
.zl-button--danger:hover:not(.is-disabled) { background: var(--zl-color-danger-hover, #f78989); border-color: var(--zl-color-danger-hover, #f78989); }
.zl-button--info { color: #fff; background: var(--zl-color-info, #909399); border-color: var(--zl-color-info, #909399); }
.zl-button--info:hover:not(.is-disabled) { background: #a6a9ad; border-color: #a6a9ad; }
/* Plain 模式：浅色背景 + 彩色边框和文字 */
.zl-button--plain.zl-button--default { color: #606266; background: #fff; border-color: #dcdfe6; }
.zl-button--plain.zl-button--default:hover:not(.is-disabled) { color: #409eff; border-color: #c6e2ff; background: #ecf5ff; }
.zl-button--plain.zl-button--primary { color: #409eff; background: #ecf5ff; border-color: #c6e2ff; }
.zl-button--plain.zl-button--primary:hover:not(.is-disabled) { color: #fff; background: #409eff; border-color: #409eff; }
.zl-button--plain.zl-button--success { color: #67c23a; background: #f0f9eb; border-color: #e1f3d8; }
.zl-button--plain.zl-button--success:hover:not(.is-disabled) { color: #fff; background: #67c23a; border-color: #67c23a; }
.zl-button--plain.zl-button--warning { color: #e6a23c; background: #fdf6ec; border-color: #faecd8; }
.zl-button--plain.zl-button--warning:hover:not(.is-disabled) { color: #fff; background: #e6a23c; border-color: #e6a23c; }
.zl-button--plain.zl-button--danger { color: #f56c6c; background: #fef0f0; border-color: #fde2e2; }
.zl-button--plain.zl-button--danger:hover:not(.is-disabled) { color: #fff; background: #f56c6c; border-color: #f56c6c; }
.zl-button--plain.zl-button--info { color: #909399; background: #f4f4f5; border-color: #e9e9eb; }
.zl-button--plain.zl-button--info:hover:not(.is-disabled) { color: #fff; background: #909399; border-color: #909399; }
.zl-button--large { padding: 12px 19px; font-size: 16px; }
.zl-button--small { padding: 5px 11px; font-size: 12px; }
.zl-button--round { border-radius: 20px; }
.zl-button.is-disabled { opacity: var(--zl-disabled-opacity, 0.6); cursor: not-allowed; }
</style>
