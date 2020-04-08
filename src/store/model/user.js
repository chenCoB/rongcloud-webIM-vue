import {me} from "../../api/user";
const state = {
    user: {
        token: '',
        id: '',
        name: ''
    }
};

const actions = {
    onUser({commit}) {
        // 获取用户信息
        me().then((res)=>{
            commit('setUser', res.data);
        });
    }
};
const mutations = {
    setUser(state, data) {
        state.user = {...state.user, ...data};
    }
};

export default  {
    state,
    actions,
    mutations
}
