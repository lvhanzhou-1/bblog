import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'

import {appMutation, userMutation} from "./mutation-types";


Vue.use(Vuex)


const store = new Vuex.Store({
    modules: {
        user,
        app,
    },

    state: {},

    getters: {},
    actions: {
        clearAll({commit}) {
            commit(appMutation.REMOVE_ALL_TAGS)
            commit(appMutation.REMOVE_SEARCHBAR)
            commit(appMutation.REMOVE_SIDEBAR)

            commit(userMutation.CLEAR_TOKEN)
            commit(userMutation.REMOVE_USER_INFO)

        }
    }
})

export default store
