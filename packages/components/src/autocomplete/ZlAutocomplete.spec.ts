import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ZlAutocomplete from './ZlAutocomplete.vue'

const mockFetchSuggestions = (query: string, cb: (list: { value: string }[]) => void) => {
  cb(query ? [{ value: `${query}1` }, { value: `${query}2` }] : [])
}

describe('ZlAutocomplete', () => {
  it('Props: placeholder 正确传递', () => {
    const wrapper = mount(ZlAutocomplete, {
      props: { placeholder: '请输入' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入')
  })

  it('Props: disabled 时 input 被禁用', () => {
    const wrapper = mount(ZlAutocomplete, {
      props: { disabled: true },
    })
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true)
  })

  it('输入后 fetchSuggestions 被调用', async () => {
    const fetchSuggestions = vi.fn((query: string, cb: (list: { value: string }[]) => void) => {
      cb([{ value: 'a1' }, { value: 'a2' }])
    })
    const wrapper = mount(ZlAutocomplete, {
      props: { fetchSuggestions, debounce: 50 },
    })
    await wrapper.find('input').setValue('a')
    await wrapper.find('input').trigger('input')
    await new Promise((r) => setTimeout(r, 100))
    expect(fetchSuggestions).toHaveBeenCalledWith('a', expect.any(Function))
  })
})
