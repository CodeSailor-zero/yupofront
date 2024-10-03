//Optionally the request above could also be done as
import axios from "axios";
//Set config defaults when creating the instance

const isDEV = process.env.NODE_ENV === 'development';

export const URL = 'localhost:8080/api';

const myAxios  = axios.create({
    baseURL: isDEV ? 'http://localhost:8080/api' : 'http://lileicode.cn:8080/api',
});

//向后台发送请求时，带上凭证
myAxios.defaults.withCredentials = true; // 允许携带 cookie


// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    console.log("我要发请求了",config);
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
    // 请求日志
    console.log("我要接收后台响应了",response.data);
    //未登录则跳转到登录页面
    if (response?.data?.code === 40100) {
        const redirectUrl = window.location.href;
        window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做写什么
    return Promise.reject(error);
});


export default myAxios;
