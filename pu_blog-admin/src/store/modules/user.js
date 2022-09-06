import {userMutation} from "@/store/mutation-types";

import {
    setToken,
    getToken,
    clearToken
} from '@/lib/cookie'

import {
    setUserInfoInLocalStorage,
    removeUserInfoInLocalStorage,
    getUserInfoInLocalStorage
} from '@/lib/local'


import {adminUserApi} from "@/api/adminUser";


export default {
    state: {
        token: getToken() || '',
        loginUserInfo: getUserInfoInLocalStorage() || '',

    },
    mutations: {
        /**
         * @param {Object} payload 后台获取到的用户信息
         * @description 设置已登录用户信息
         */
        [userMutation.SET_USER_INFO](state, payload) {
            // 将用户信息存到local storage中
            setUserInfoInLocalStorage(payload)

            // if(payload.user_name = 'testUser'){

            // }
            state.loginUserInfo = payload
        },
        /**
         * @description 清除已登录用户信息
         * @param state
         */
        [userMutation.REMOVE_USER_INFO](state) {
            // 清除 local storage 中的 loginUserInfo
            removeUserInfoInLocalStorage()
            state.loginUserInfo = ''
        },

        /**
         * @param state
         * @param {String} payload 后台获取到的token
         * @description 设置token
         */
        [userMutation.SET_TOKEN](state, payload) {
            // 将token存到cookie中
            setToken(payload)
            state.token = payload
        },
        /**
         * @description 清除token
         * @param state
         */
        [userMutation.CLEAR_TOKEN](state) {
            // 清除cookie中的token
            clearToken()
            state.token = ''
        },


    },
    actions: {
        async setLoginUserInfo({commit}) {
            /*从后端获取*/

            return new Promise(async (resolve, reject) => {
                console.info("🚀 ~ file:user method:setLoginUserInfo line:75 -----setLoginUserInfo({commit})", 'setLoginUserInfo({commit})')
                let {data} = await adminUserApi.getLoginAdminInfo()
                console.info("🚀 ~ file:user method:setLoginUserInfo line:75 -----adminUserApi.getLoginAdminInfo()", data)

                commit(userMutation.SET_USER_INFO, data.data);
                resolve(data)
            })
        }
    }
}
