import {request} from './request'

export function validateLogin(username,password){
    return request({
        url:'/login',
        method:'post',
        params:{
            username,
            password
        }
    })
}