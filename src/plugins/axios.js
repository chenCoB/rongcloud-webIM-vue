"use strict";

import axios from "axios";
import router from '../router/index';
import Nutui from "@nutui/nutui";
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
let url;

if (process.env.NODE_ENV === "development") {
    // 代理地址
    url = '/' + process.env.VUE_APP_API + '/api'

} else if (process.env.NODE_ENV === "production") {
    url = process.env.VUE_APP_API + '/api'
}

let config = {
    baseURL: url,
    timeout: 60 * 1000, // Timeout
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true, // Check cross-site Access-Control
};

function errorMessage(error) {
    let message = [];
    if (error.errors) {
        for (let i in error) {
            message.push(error[i][0]);
        }
    } else {
        if (error.message) {
            message.push(error.message)
        } else if(error.error){
            message.push(error.error)
        }

    }
    Nutui.Dialog[0]({
        noOkBtn: true,
        title: "错误",
        cancelBtnTxt: '知道了',
        content: message[0]
    })

}
const _axios = axios.create(config);

_axios.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        let token = localStorage.getItem('imToken');
       if (token) {
           config.headers['Authorization'] = `Bearer ${token}`;
       }

        return config;

    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    function(response) {
        // Do something with response data
        return response;
    },
    function(error) {
        // Do something with response error
        switch (error.response.status) {
            case 401:
                localStorage.removeItem('imToken');
                localStorage.removeItem('rongToken');
                if (router.history.current.name != 'login') {
                    router.replace('/login');
                }
                break;
            default:
                errorMessage(error.response.data);
        }

        return Promise.reject(error);
    }
);


export default _axios;
