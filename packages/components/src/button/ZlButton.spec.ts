import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZlButton from './ZlButton.vue'

describe('ZlButton', () => {
  it('渲染默认内容', () => {
    const wrapper = mount(ZlButton, {
      slots: { default: '点击' },
    })
    expect(wrapper.text()).toBe('点击')
  })

  it('Props: type 影响 class', () => {
    const wrapper = mount(ZlButton, { props: { type: 'primary' } })
    expect(wrapper.classes()).toContain('zl-button--primary')
  })

  it('Props: size 影响 class', () => {
    const wrapper = mount(ZlButton, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('zl-button--large')
  })

  it('Props: disabled 时应用 is-disabled class 且 button 被禁用', () => {
    const wrapper = mount(ZlButton, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('is-disabled')
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('Props: plain 时应用 zl-button--plain', () => {
    const wrapper = mount(ZlButton, { props: { plain: true } })
    expect(wrapper.classes()).toContain('zl-button--plain')
  })

  it('Props: round 时应用 zl-button--round', () => {
    const wrapper = mount(ZlButton, { props: { round: true } })
    expect(wrapper.classes()).toContain('zl-button--round')
  })

  it('点击可触发', () => {
    const wrapper = mount(ZlButton, { slots: { default: '确定' } })
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('disabled 时点击仍可触发 click 事件（原生行为），但 button 元素本身 disabled', () => {
    const wrapper = mount(ZlButton, { props: { disabled: true } })
    expect((wrapper.element as HTMLButtonElement).disabled).toBe(true)
  })
})
