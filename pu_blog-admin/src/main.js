import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
// ===========================================================
//store
import store from "./store";
// ===========================================================
//VueRouter
import VueRouter from "vue-router";
import "@/router/permission"; //路由守卫
import router from "./router";

Vue.use(VueRouter);
// ===========================================================
//VueParticles
import VueParticles from "vue-particles";

Vue.use(VueParticles);
// ===========================================================
//ElementUI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
// ===========================================================
//vue-fragment
import Fragment from "vue-fragment";
Vue.use(Fragment.Plugin);
// ===========================================================
//VueClipboard 复制
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
// ===========================================================
//自定义预设样式
import "@/styles/reset.scss";
// ===========================================================
//svg注册
import "@/icons";
// ===========================================================
// mavonEditor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use
Vue.use(mavonEditor)


new Vue({
	render: (h) => h(App),
	router,
	store,
}).$mount("#app");
