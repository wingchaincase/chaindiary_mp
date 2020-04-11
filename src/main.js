import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './static/iconfont/iconfont.css'
Vue.config.productionTip = false

new App({
  store: store
}).$mount()
