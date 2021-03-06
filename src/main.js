// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import less from 'less'
import * as Utils from '@/utils';
Vue.use(less)
import * as api from '@/api';
//样式
import '@/assets/style/utility.less';
Vue.use(ElementUI);
Vue.prototype.$auth = {
  check: Utils.authCheck
};
Vue.config.productionTip = false;
Vue.prototype.$api = api;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
