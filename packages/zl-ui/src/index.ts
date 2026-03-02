/**
 * zl-ui - 主入口包
 * 聚合 components、utils、theme，提供统一安装入口
 */

import type { App } from 'vue'
import * as components from '@zl-ui/components'
import { Message } from '@zl-ui/components'

const ZlUi = {
  install(app: App) {
    Object.entries(components).forEach(([name, component]) => {
      if (name.startsWith('Zl') && component) {
        app.component(name, component)
      }
    })
    app.config.globalProperties.$message = Message
  },
}

export default ZlUi
export * from '@zl-ui/components'
export * from '@zl-ui/utils'
export { Message } from '@zl-ui/components'
