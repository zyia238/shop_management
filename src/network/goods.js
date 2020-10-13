import {request} from './request'

export function getGoodsList(type,pagenum,pagesize){
    return request({
        url:'/categories',
        params:{
            type,
            pagenum,
            pagesize
        }
    })
}

export function addGoodsCate(cat_pid,cat_name,cat_level){
    return request({
        url:'/categories',
        method:'post',
        data:{
            cat_pid,
            cat_name,
            cat_level
        }
    })
}

export function addParentsGoodsList(){
    return request({
        url:'/categories',
        params:{
            type:2
        }
    })
}