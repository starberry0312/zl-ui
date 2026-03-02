import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ZlUpload from './ZlUpload.vue'

describe('ZlUpload', () => {
  it('渲染默认提示文案', () => {
    const wrapper = mount(ZlUpload)
    expect(wrapper.text()).toContain('点击上传')
  })

  it('Props: drag 时显示拖拽区域', () => {
    const wrapper = mount(ZlUpload, { props: { drag: true } })
    expect(wrapper.find('.zl-upload-dragger').exists()).toBe(true)
  })

  it('Props: disabled 时 drag 区域应用 is-disabled', () => {
    const wrapper = mount(ZlUpload, { props: { drag: true, disabled: true } })
    expect(wrapper.find('.zl-upload-dragger').classes()).toContain('is-disabled')
  })

  it('Props: accept 传递给 input', () => {
    const wrapper = mount(ZlUpload, { props: { accept: 'image/*' } })
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('accept')).toBe('image/*')
  })

  it('点击触发区域可触发', async () => {
    const wrapper = mount(ZlUpload)
    expect(wrapper.find('.zl-upload__trigger').exists()).toBe(true)
    await wrapper.find('.zl-upload__trigger').trigger('click')
  })
})
