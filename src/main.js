import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import NutUI from '@nutui/nutui';
import '@nutui/nutui/dist/nutui.scss';
import './plugins/axios'
import './im-plug-in/qiniu';
import './im-plug-in/upload';
import './im-plug-in/init.js';
import './libs/filter';
import './assets/font-coin/iconfont.css'
NutUI.install(Vue);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
