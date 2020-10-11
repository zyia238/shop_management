import {request} from './request'

export function getRightsList(){
    return request({
        url:'rights/list'
    })
}

export function getRightsListTree(){
    return request({
        url:'rights/tree'
    })
}

export function getCharacterList(){
    return request({
        url:'roles'
    })
}

export function addRole(roleName,roleDesc){
    return request({
        url:'roles',
        method:'post',
        data:{
            roleName,
            roleDesc
        }
    })
}

export function deleteRole(id){
    return request({
        url:'roles/' + id,
        method:'delete'
    })
}

export function deleteTag(roleID,rightID){
    return request({
        url:'roles/'+ roleID +'/rights/' + rightID,
        method:'delete'
    })
}

export function editRole(id,roleName,roleDesc){
    return request({
        url:'roles/' + id,
        method:'put',
        data:{
            roleName,
            roleDesc
        }
    })
}

export function allocateRole(roleId,rids){
    return request({
        url:'roles/'+roleId +'/rights',
        method:'post',
        data:{
            rids
        }
    })
}
