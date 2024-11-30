import App from './App'
import messages from './locale/index'
import { createI18n } from 'vue-i18n'// v9.x

let i18nConfig = {
  locale: uni.getLocale(),
  messages
}

// #ifndef VUE3
import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  i18n,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
const i18n = createI18n(i18nConfig)
  const app = createSSRApp(App)
  app.use(i18n)
  return {
    app
  }
}
// #endif