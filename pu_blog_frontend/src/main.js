import Vue from 'vue'
import App from '@/App.vue'
//=====================================================================

import router from '@/router'
import '@/router/permission'

import store from "@/store";
//=====================================================================
/** 测试scss 全局引入样式*/

import '@/styles/reset.scss'
//=====================================================================
/** 额外的标签 不会被v-for渲染出来*/

import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)
Vue.config.productionTip = false
//=====================================================================
/** 粒子背景插件*/
import VueParticles from 'vue-particles'

Vue.use(VueParticles)
//=====================================================================
/** ElementUI*/
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)
//=====================================================================
// mavonEditor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use
Vue.use(mavonEditor)
//=====================================================================
/** 图标*/
import './assets/iconfont/iconfont.js'
import './assets/iconfont/icon.css'
import IconFont from "@/components/IconFont/IconFont";



Vue.component('IconFont', IconFont)

import './assets/iconfont/iconfont.css'

//=====================================================================
 import mouse from '@/lib/mouseClick'

Vue.use(mouse)



//=====================================================================
// /** 引入 highlight.js 代码高亮工具*/
// import hljs from "highlight.js";
// // 使用样式，有多种样式可选
// import "highlight.js/styles/docco.css";

// // 增加自定义命令v-highlight
// Vue.directive("highlight", function (el) {
//     let blocks = el.querySelectorAll("pre code");
//     blocks.forEach(block => {
//         hljs.highlightBlock(block);
//     });
// });
// // 增加组定义属性，用于在代码中预处理代码格式
// Vue.prototype.$hljs = hljs;
//=====================================================================

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
