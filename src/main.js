import Vue from "vue";
import App from "./App";
import router from "./router/index";
import axios from "axios";
import VueNotify from 'vue-notifyjs'
import 'vue-notifyjs/themes/default.css'
import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";
import VueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'

window.axios = axios;

Vue.use(PaperDashboard);
Vue.use(VueNotify)
Vue.use(VueAxios, axios)

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
