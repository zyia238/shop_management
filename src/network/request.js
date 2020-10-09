import axios from 'axios'

export function request(options){
    var instance = axios.create({
        baseURL:'http://127.0.0.1:8888/api/private/v1/',
        timeout:5000
    })
    //需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
    instance.interceptors.request.use(config => {
        //拦截器的config属性就代表要预处理的请求对象
        // console.log(config)
        config.headers.Authorization = sessionStorage.getItem('token')
        //固定写法
        return config
    })
    return instance(options)
}