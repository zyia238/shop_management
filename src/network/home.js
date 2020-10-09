import {request} from './request'

//请求侧边栏数据的接口
export function getAsideData(){
    return request({
        url:'/menus'
    })
}

//根据用户ID查询实时数据
export function getEditUserFromInfo(uid){
    return request({
        url:'/users/' + uid
    })
}

//请求列表数据的接口
export function getUserList(query,pagenum,pagesize){
    return request({
        url:'/users',
        params:{
            query,
            pagenum,
            pagesize
        }
    })
}

export function addUser(username,password,email,mobile){
    return request({
        url:'/users',
        method:'post',
        //params属性只用于传递GET方式发送的请求的参数
        data:{
            username,
            password,
            email,
            mobile
        }
    })
}

//更改用户数据的接口，type为true或者false，会在数据库里更改用户的状态
export function changeUserStatus(uId,type){
    return request({
        url:'users/'+ uId +'/state/'+ type,
        method:'put'
    })
}

//提交编辑用户信息
export function editUserInfo(id,email,mobile){
    return request({
        url:'users/'+ id,
        method:'put',
        data:{
            email,
            mobile
        }
    })
}

export function deleteUserInfo(id){
    return request({
        url:'users/'+ id,
        method:'delete',
        data:{
            id
        }
    })
}