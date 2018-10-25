import Vue from "vue";
import App from "./App";
import router from "./router/index";
import axios from "axios";

/*window.axios = axios({
    baseURL: 'http://timex.test/',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
});*/
window.axios = axios;

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

Vue.use(PaperDashboard);

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
