import axios from "axios";
import {Message, MessageBox, Loading} from 'element-ui'

import store from '@/store'
import router from '@/router'


let loading = null; // 全局唯一loading框
let requestNum = 0; // 同一时间的接口请求数

let baseUrl = process.env.VUE_APP_BASE_URL



axios.defaults.baseURL = baseUrl;
axios.defaults.timeout = 10 * 1000;


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers['client'] = 'admin';// 固定传入的值，用来区分来自那里

    if (store.state.user.token) {
        config.headers['Authorization'] = store.state.user.token;// 让每个请求携带token

    }
    config.headers['userid'] = store.state.user.loginUserInfo.uid;//让每个请求携带当前登录用户的uid
    config.headers['username'] = store.state.user.loginUserInfo.user_name;//让每个请求携带当前登录用户的uid
    // 请求加1
    requestNum++


    loading = Loading.service({fullscreen: true, text: '正在努力加载中~~~'})


    return config;

}, function (error) {
    // 对请求错误做些什么

    // 出错了直接关闭loading
    requestNum = 0
    if (loading) {
        loading.close();
    }
    return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // 请求数减1
    requestNum--

    if (requestNum <= 0) {
        loading.close()
    }

    // 响应的状态码如果是0，提示报错
    if (response.data.code === 0) {
        let data = response.data;
        Message({
            message: data.extendInfo ? data.extendInfo : data.msg,
            type: 'error',
            duration: 1500,
        })
    }


    return response;
}, function (error) {
    // 对响应错误做点什么
    console.dir(error)

    requestNum = 0

    loading.close()

    if (!error.response && error.message === 'Network Error') {
        Message.error('服务端未开启')
    } else if (!error.response && /timeout/.test(error.message)) {
        Message.error('接口响应超时')
    } else {
        switch (error.response.status) {
            case 401:
                MessageBox.confirm('token已过期，可以取消继续留在该页面，或者重新登录', '重新登录',
                    {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        showClose: false,
                        closeOnClickModal: false,
                        type: 'warning'
                    }
                ).then(async () => {
                    await store.dispatch('clearAll')
                    await router.push('./login')
                })
                break;
        }
    }

    return Promise.reject(error);
});


export default axios
