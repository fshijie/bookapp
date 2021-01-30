/**
 * axios配置文件
 */

// 在http.js中引入axios
import axios from 'axios'; // 引入axios
import QS from 'qs';
import { Message, MessageBox } from 'element-ui';
import router from '@/router';
import config from '../config';

let vm;

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = config.apiBaseUrl;

axiosInstance.defaults.timeout = 0;
axiosInstance.defaults.validateStatus = status => {
    return status >= 200 && status < 300; // default
};

axiosInstance.interceptors.request.use(config => {
    if (config.method === 'get') {
        config.params = {
            _t: Date.now(),
            ...config.params,
        };
    }

    config.headers = {
        ...(config.headers || {}),
        token: global.localStorage.getItem('token'),
    };
    return config;
});

axiosInstance.interceptors.response.use(
    response => {
        if (response.headers && response.headers.token) {
            global.localStorage.setItem('token', response.headers.token);
        }

        // token过期，重新登录
        if (response.data && response.data.status === 40301) {
            // 删除本地token
            global.localStorage.removeItem('token');
        }

        if (!_.has(response.data, 'rel')) {
            return response.data;
        }

        if (response.data.rel) {
            return response.data.data;
        }
        Message({
            message: response.data.message || response.data.msg,
            type: 'error',
            duration: 5 * 1000,
            showClose: true,
        });

        return Promise.reject(new Error(response.data.message || response.data.msg));
        // return response;
    },
    error => {
        // token过期，重新登录
        if (error.response && error.response.status === 401) {
            // 删除本地token
            global.localStorage.removeItem('token');
            return handleTokenExpire();
        }

        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000,
            showClose: true,
        });

        return Promise.reject(error);
    }
);

export default axiosInstance;

export const setVm = vueInstance => (vm = vueInstance);
