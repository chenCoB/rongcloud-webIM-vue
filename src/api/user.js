import _axios from '@/plugins/axios'

//获取融云token
export function getToken(appKey) {
    return _axios({
        url: '/user/token',
        method: 'post',
        data:{
            appKey
        }
    })

}

export function getUserList() {
    return _axios({
        url: '/user/list',
        method: 'get'
    })

}

// 登录
export function login({email, password}) {
    return _axios({
        url: '/auth/login',
        method: 'post',
        data:{
            email,
            password
        }
    })

}

// 注册
export function register({name, email, password}) {
    return _axios({
        url: '/auth/register',
        method: 'post',
        data:{
            name,
            email,
            password,
            role:2
        }
    })

}

// 退出登录
export function logout() {
    return _axios({
        url: '/auth/logout',
        method: 'post'
    })

}


// 获取我的
export function me() {
    return _axios({
        url: '/user/getInfo',
        method: 'post'
    })

}
