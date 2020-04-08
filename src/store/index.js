import Vue from 'vue'
import Vuex from 'vuex'
import userModel from './model/user'
import rongCloud from './model/rongCloud'
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        userModel,
        rongCloud
    }
})
