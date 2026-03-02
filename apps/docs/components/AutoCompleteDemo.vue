<script setup lang="ts">
import { ref } from 'vue'
import { escapeRegex } from '@zl-ui/utils'

const restaurants = [
  { value: '三全鲜食', address: '长宁区' },
  { value: 'Hot honey', address: '虹口区' },
  { value: 'Erigo 意大利餐厅', address: '静安区' },
]

const state = ref('')

const querySearch = (query: string, cb: (list: { value: string; address: string }[]) => void) => {
  const results = query
    ? restaurants.filter((r) => r.value.toLowerCase().includes(query.toLowerCase()))
    : restaurants
  cb(results)
}

const highlightText = (text: string, query: string) => {
  if (!query) return text
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')
  return text.replace(regex, '<span style="color:#409eff;font-weight:bold">$1</span>')
}
</script>

<template>
  <div class="demo-block">
    <ZlAutocomplete
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="请输入"
      style="width: 200px"
    />
  </div>
  <div class="demo-block">
    <h4>自定义模板 + 高亮</h4>
    <ZlAutocomplete
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="输入搜索"
      style="width: 240px"
    >
      <template #default="{ item }">
        <div v-html="highlightText(item.value, state)"></div>
      </template>
    </ZlAutocomplete>
  </div>
</template>
