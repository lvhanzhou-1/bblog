/**
 * 添加路由守卫
 * */

import router from "../router";
import store from "@/store/index";
// import NProgress from "nprogress"; // Progress 进度条
// import "nprogress/nprogress.css"; // Progress 进度条样式

const needLoginPathReg = /\/user\/settings/; // 需要token才能访问的页面的正则
const allList = getAllPath(router.options.routes); // 所有已配置过的路由，如果输入的地址不在范围内，重定向到404

// 路由开始前钩子 next() 放行
router.beforeEach(async (to, from, next) => {
    // NProgress.start()
    // 首先判断是不是乱七八糟输入的网址，如果是乱七八糟输的网址，全部跳转到404页
    // 需要特殊处理的一些路由配置 比如：/subjectInfo/:id，这样的路由会变成/subjectInfo/b0cd6ff0-0fba-11ec-8c31-9be3602f15a5 属于正常的，放行
    // 需要特殊处理的一些路由配置 比如：/articleDetail/:id，这样的路由会变成/articleDetail/b0cd6ff0-0fba-11ec-8c31-9be3602f15a5 属于正常的，放行

    // if (to.path !== from.path) {
    // 	store.state.isLoading = true;
    // }

    if (to.meta.title) {
        document.title = to.meta.title + "-LHZ的个人博客";
    } else {
        document.title = "LHZ的个人博客";
    }


    if (allList.indexOf(to.path) === -1 && !/\/subjectInfo\/\w.*/.test(to.path) && !/\/articleDetail\/\w.*/.test(to.path)) {
        next({path: "/404"});
        // NProgress.done()
    } else {
        // 如果是正常的地址
        if (store.state.user.token) {

            console.info("🚀 ~ file:permission method: line:46 -----store.state.user.token", store.state.user.token)
            // 如果有token
            /*
             *  如果有token，拿一下个人信息，
             *       从local storage 中拿，
             *       local storage中如果没有，就用token 从后端拿，保存在本地 local storage 中
             * */

            console.info("🚀 ~ file:permission method: line:46 -----store",store )
            // if (!store.state.user.loginUserInfo) {
            await store.dispatch("setLoginUserInfo");
            // }

            next();
        } else {
            // 如果没有token，判断一下是否是需要token才能进的页面
            // 需要token的页面
            if (needLoginPathReg.test(to.path)) {
                next(`/`); // 否则全部重定向到首页
                // NProgress.done();
            } else {
                // 如果不是需要token才能进的页，放行
                next();
            }
        }
    }
});

// 路由结束后钩子
router.afterEach(() => {
    // NProgress.done()
    // setTimeout(() => {
    // store.state.isLoading = false;
    // }, 700)
});

function getAllPath(routers, resultArr = []) {
    routers.map((item) => {
        resultArr.push(item.path);
        if (item.children) {
            getAllPath(item.children, resultArr);
        }
    });

    return resultArr;
}
