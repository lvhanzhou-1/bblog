import axios from "axios";

import {Message} from "element-ui";
// import { Loading} from "element-ui";


import store from '@/store'
// import router from "@/router";

// let loading = null; // 全局唯一loading框
let requestNum = 0; // 同一时间的接口请求数

let baseURL = process.env.VUE_APP_BASE_URL

//axios基本配置
axios.defaults.baseURL = baseURL
// axios.defaults.baseURL = '/api'

// 超时时间
axios.defaults.timeout = 10 * 1000 // 单位ms

// 添加请求拦截器
axios.interceptors.request.use(config => {
    // 在发送请求之前做些什么

    config.headers['client'] = 'web'


    if (store.state.user.token) {
        config.headers['Authorization'] = store.state.user.token // 让每个请求携带token
        // config.headers['userId'] = store.state.user.loginUserInfo.uid // 让每个请求携带当前登录用户的uid

        // config.headers['userName'] = store.state.user.loginUserInfo.user_name
    }

    // 请求加1
    requestNum++;

    // loading = Loading.service({fullscreen: true, text: '正在努力加载中~~~'});
    store.state.isLoading = true

    return config;
}, error => {
    // 对请求错误做些什么

    // 出错了直接关闭loading
    requestNum = 0
    // if (loading) {
    //     loading.close();
    // }
    if(store.state.isLoading){
        store.state.isLoading = false;
    }


    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
    // 对响应数据做点什么


    // 请求数减1
    requestNum--

    // if (requestNum <= 0) {
    //     loading.close()
    // }



    // 响应的状态码如果是0，提示报错,后端规定好的
    if (response.data.code === 0) {
        let data = response.data
        Message({
            message: data.extendInfo ? data.extendInfo : data.msg,
            type: 'error',
            duration: 1500,
        })
    }

    if(requestNum <= 0){
        store.state.isLoading = false;
    }

    return Promise.resolve(response);
}, error => {
    // 对响应错误做点什么
    console.dir(error)
    // 出错了直接关闭loading
    requestNum = 0
    // loading.close()
    store.state.isLoading = false;

    if (!error.response && error.message === 'Network Error') {
        Message.error('服务端未开启')
    } else if (!error.response && /timeout/.test(error.message)) {
        Message.error('接口响应超时')
    } else {
        switch (error.response.status) {
            // token过期或者未登录
            case 401:
                MessageBox.confirm(
                    'token已过期，可以取消继续留在该页面，或者重新登录',
                    '重新登录',
                    {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        showClose: false,
                        closeOnClickModal: false,
                        type: 'warning'
                    }
                ).then(async () => {
                    //1、清除已过期token
                    //2、跳转到登录页
                    await store.dispatch('clearAll')
                    await router.push('/login')
                })
                break;
        }
    }
    return Promise.reject(error);
});


export default axios
