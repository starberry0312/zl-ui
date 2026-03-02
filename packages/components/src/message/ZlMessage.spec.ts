import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZlMessage from './ZlMessage.vue'

describe('ZlMessage', () => {
  it('Props: message 正确渲染', () => {
    const wrapper = mount(ZlMessage, {
      props: { message: '操作成功', visible: true, 'onUpdate:visible': () => {} },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.text()).toContain('操作成功')
  })

  it('Props: type 影响 class', () => {
    const wrapper = mount(ZlMessage, {
      props: { type: 'success', message: 'ok', visible: true },
      global: { stubs: { Teleport: true } },
    })
    const msgEl = wrapper.find('.zl-message')
    expect(msgEl.exists()).toBe(true)
    expect(msgEl.classes()).toContain('zl-message--success')
  })

  it('visible 为 false 时通过 v-show 隐藏', async () => {
    const wrapper = mount(ZlMessage, {
      props: { visible: false, message: '隐藏', 'onUpdate:visible': () => {} },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.find('.zl-message').exists()).toBe(true)
    expect(wrapper.find('.zl-message').isVisible()).toBe(false)
  })

  it('visible 为 true 时显示', async () => {
    const wrapper = mount(ZlMessage, {
      props: { visible: true, message: '显示', 'onUpdate:visible': () => {} },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.text()).toContain('显示')
  })
})
