import axios from 'axios'

export function request(options){
    var instance = axios.create({
        baseURL:'http://127.0.0.1:8888/api/private/v1/',
        timeout:5000
    })

    return instance(options)
}