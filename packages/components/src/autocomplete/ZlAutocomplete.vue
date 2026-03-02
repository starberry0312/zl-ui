<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from '@zl-ui/utils'
import type { AutocompleteSuggestion, FetchSuggestionsTrigger } from './types'
import { EVENT_CODE } from './types'

defineOptions({
  name: 'ZlAutocomplete',
})

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    debounce?: number
    fetchSuggestions?: FetchSuggestionsTrigger
    placeholder?: string
    disabled?: boolean
    size?: 'large' | 'default' | 'small'
    triggerOnFocus?: boolean
    hideWhenNoMatch?: boolean
    loopNavigation?: boolean
    highlightFirstItem?: boolean
  }>(),
  {
    modelValue: '',
    debounce: 300,
    placeholder: '',
    disabled: false,
    size: 'default',
    triggerOnFocus: true,
    hideWhenNoMatch: true,
    loopNavigation: true,
    highlightFirstItem: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'input', value: string): void
  (e: 'change', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
  (e: 'select', item: AutocompleteSuggestion): void
}>()

const inputRef = ref<HTMLInputElement>()
const listboxRef = ref<HTMLDivElement>()

const state = reactive({
  inputValue: String(props.modelValue ?? ''),
})

const suggestions = ref<AutocompleteSuggestion[]>([])
const suggestionVisible = ref(false)
const activated = ref(false)
const highlightedIndex = ref(-1)
const loading = ref(false)
const dropdownWidth = ref(0)

async function getData(queryString: string) {
  if (!props.fetchSuggestions) return
  loading.value = true
  try {
    props.fetchSuggestions(queryString, (list) => {
      suggestions.value = list
      loading.value = false
      if (props.highlightFirstItem && list.length > 0) {
        highlightedIndex.value = 0
      } else {
        highlightedIndex.value = -1
      }
    })
  } catch (e) {
    loading.value = false
    console.warn('[ZlAutocomplete]', e)
  }
}

const debouncedGetData = debounce(getData, props.debounce)

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  state.inputValue = value
  emit('update:modelValue', value)
  emit('input', value)
  if (props.fetchSuggestions && value) {
    debouncedGetData(value)
  } else {
    suggestions.value = []
    highlightedIndex.value = -1
  }
}

function handleFocus(event: FocusEvent) {
  activated.value = true
  if (props.triggerOnFocus && props.fetchSuggestions) {
    suggestionVisible.value = true
    getData(state.inputValue)
  }
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  setTimeout(() => {
    activated.value = false
    suggestionVisible.value = false
    emit('blur', event)
  }, 150)
}

function handleKeydown(event: KeyboardEvent) {
  const code = event.code
  if (!suggestions.value.length) {
    if (code === EVENT_CODE.esc || code === EVENT_CODE.tab) close()
    return
  }

  switch (code) {
    case EVENT_CODE.up:
      event.preventDefault()
      highlight(-1)
      break
    case EVENT_CODE.down:
      event.preventDefault()
      highlight(1)
      break
    case EVENT_CODE.enter:
      event.preventDefault()
      const item = suggestions.value[highlightedIndex.value]
      if (item) select(item)
      break
    case EVENT_CODE.esc:
      event.preventDefault()
      close()
      break
    case EVENT_CODE.tab:
      close()
      break
    case EVENT_CODE.home:
      event.preventDefault()
      highlightTo(0)
      break
    case EVENT_CODE.end:
      event.preventDefault()
      highlightTo(suggestions.value.length - 1)
      break
    case EVENT_CODE.pageUp:
      event.preventDefault()
      highlight(-10)
      break
    case EVENT_CODE.pageDown:
      event.preventDefault()
      highlight(10)
      break
  }
}

function highlightTo(index: number) {
  if (!suggestions.value.length) return
  highlightedIndex.value = Math.max(0, Math.min(index, suggestions.value.length - 1))
  scrollToItem(highlightedIndex.value)
}

function highlight(delta: number) {
  if (!suggestions.value.length) return
  let newIndex = highlightedIndex.value + delta
  if (newIndex < 0) {
    newIndex = props.loopNavigation ? suggestions.value.length - 1 : 0
  } else if (newIndex >= suggestions.value.length) {
    newIndex = props.loopNavigation ? 0 : suggestions.value.length - 1
  }
  highlightedIndex.value = newIndex
  scrollToItem(newIndex)
}

function scrollToItem(index: number) {
  const listbox = listboxRef.value
  if (!listbox) return
  const items = listbox.querySelectorAll('.zl-autocomplete-suggestion__item')
  const item = items[index] as HTMLElement
  if (item) item.scrollIntoView({ block: 'nearest' })
}

function select(item: AutocompleteSuggestion) {
  if (!item) return
  state.inputValue = item.value
  emit('update:modelValue', item.value)
  emit('change', item.value)
  emit('select', item)
  close()
}

function close() {
  suggestionVisible.value = false
  activated.value = false
  highlightedIndex.value = -1
}

function handleClear() {
  state.inputValue = ''
  emit('update:modelValue', '')
  emit('clear')
  suggestions.value = []
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (inputRef.value?.contains(target) || listboxRef.value?.contains(target)) return
  suggestionVisible.value = false
  activated.value = false
}

const showPopper = computed(() => {
  const hasSuggestions = suggestions.value.length > 0
  const shouldHide = props.hideWhenNoMatch && !hasSuggestions
  return suggestionVisible.value && !shouldHide && activated.value
})

function updateDropdownWidth() {
  if (inputRef.value) dropdownWidth.value = inputRef.value.offsetWidth
}

watch(() => props.modelValue, (v) => {
  state.inputValue = String(v ?? '')
})

onMounted(() => {
  updateDropdownWidth()
  window.addEventListener('resize', updateDropdownWidth)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDropdownWidth)
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  close,
})
</script>

<template>
  <div class="zl-autocomplete">
    <input
      ref="inputRef"
      :value="state.inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="zl-autocomplete__input"
      :class="[`zl-autocomplete__input--${size}`]"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span
      v-if="state.inputValue && !disabled"
      class="zl-autocomplete__clear"
      @click="handleClear"
    >
      ×
    </span>

    <Transition name="zl-autocomplete-fade">
      <div
        v-show="showPopper"
        ref="listboxRef"
        class="zl-autocomplete__suggestion"
        :style="{ width: `${dropdownWidth}px` }"
      >
        <div v-if="loading" class="zl-autocomplete__loading">加载中...</div>
        <template v-else>
          <div
            v-for="(item, index) in suggestions"
            :key="index"
            class="zl-autocomplete-suggestion__item"
            :class="{ 'is-highlighted': index === highlightedIndex }"
            @click="select(item)"
            @mouseenter="highlightedIndex = index"
          >
            <slot :item="item">
              {{ item.value }}
            </slot>
          </div>
          <div v-if="!suggestions.length" class="zl-autocomplete__empty">无匹配数据</div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.zl-autocomplete {
  position: relative;
  display: inline-block;
  width: 100%;
}

.zl-autocomplete__input {
  width: 100%;
  padding: 8px 12px;
  font-size: var(--zl-font-size-base);
  border: 1px solid var(--zl-border-color);
  border-radius: var(--zl-border-radius-base);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: var(--zl-background-color);
  color: var(--zl-text-color-regular);
}

.zl-autocomplete__input:focus {
  border-color: var(--zl-color-primary);
}

.zl-autocomplete__input--large {
  padding: 10px 14px;
  font-size: 16px;
}

.zl-autocomplete__input--small {
  padding: 6px 10px;
  font-size: 13px;
}

.zl-autocomplete__input:disabled {
  background: var(--zl-fill-color);
  cursor: not-allowed;
}

.zl-autocomplete__clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  line-height: 14px;
  text-align: center;
  font-size: var(--zl-font-size-base);
  color: var(--zl-text-color-placeholder);
  cursor: pointer;
  border-radius: 50%;
}

.zl-autocomplete__clear:hover {
  color: var(--zl-text-color-secondary);
  background: var(--zl-fill-color);
}

.zl-autocomplete__suggestion {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  background: var(--zl-background-color);
  border: 1px solid var(--zl-border-color-light);
  border-radius: var(--zl-border-radius-base);
  box-shadow: var(--zl-box-shadow-base);
  z-index: 1000;
  max-height: 280px;
  overflow-y: auto;
  box-sizing: border-box;
}

.zl-autocomplete-suggestion__item {
  padding: 0 20px;
  margin: 0;
  line-height: 34px;
  cursor: pointer;
  color: var(--zl-text-color-regular);
  font-size: var(--zl-font-size-base);
  list-style: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.zl-autocomplete-suggestion__item:hover,
.zl-autocomplete-suggestion__item.is-highlighted {
  background: var(--zl-fill-color);
}

.zl-autocomplete__loading,
.zl-autocomplete__empty {
  padding: 10px 16px;
  font-size: var(--zl-font-size-base);
  color: var(--zl-text-color-secondary);
  text-align: center;
}

.zl-autocomplete-fade-enter-active,
.zl-autocomplete-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.zl-autocomplete-fade-enter-from,
.zl-autocomplete-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
