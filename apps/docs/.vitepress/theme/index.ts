import DefaultTheme from 'vitepress/theme'
import ZlUi from 'zl-ui'
import '@zl-ui/theme/vars.css'
import '@zl-ui/components/styles.css'
import '@zl-ui/theme'
import '@zl-ui/theme/dark.css'
import MessageDemo from '../../components/MessageDemo.vue'
import UploadDemo from '../../components/UploadDemo.vue'
import AutoCompleteDemo from '../../components/AutoCompleteDemo.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(ZlUi)
    app.component('MessageDemo', MessageDemo)
    app.component('UploadDemo', UploadDemo)
    app.component('AutoCompleteDemo', AutoCompleteDemo)
  },
}
