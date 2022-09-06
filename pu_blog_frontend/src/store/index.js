import Vue from 'vue'
import Vuex from 'vuex'
import {userMutation, indexMutation} from "./mutation-types";

Vue.use(Vuex)

import messageBoard from "@/store/modules/messageBoard";
import user from "@/store/modules/user";


const store = new Vuex.Store({
    modules: {
        messageBoard,
        user,
    },

    state: {
        // 是否展示登录框
        isShowLoginBox: false,
        isLoading:true
    },

    mutations: {
        /**
         * @description 显示登录框
         */
        [indexMutation.SHOW_LOGIN_DIALOG](state) {
            state.isShowLoginBox = true
        },
        /**
         * @description 隐藏登录框
         */
        [indexMutation.HIDDEN_LOGIN_DIALOG](state) {
            state.isShowLoginBox = false
        },
    },


    actions: {
        // clearAll({commit}){
        //     return new Promise(async (resolve) => {
        //         commit(userMutation.CLEAR_TOKEN)
        //         commit(userMutation.REMOVE_USER_INFO)
        //         resolve()
        //     })
        // },

        async clearAll({commit}) {
            await commit(userMutation.CLEAR_TOKEN)
            await commit(userMutation.REMOVE_USER_INFO)

            window.location.reload()
        }
    },
})

export default store
