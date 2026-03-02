import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'zl-ui',
  description: 'Vue 3 组件库',
  themeConfig: {
    nav: [
      { text: '快速上手', link: '/guide/quick-start' },
      { text: '组件', link: '/components/button' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速上手', link: '/guide/quick-start' },
        ],
      },
      {
        text: '组件',
        items: [
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'Message 消息', link: '/components/message' },
          { text: 'Upload 上传', link: '/components/upload' },
          { text: 'AutoComplete 自动完成', link: '/components/autocomplete' },
        ],
      },
    ],
  },
})
