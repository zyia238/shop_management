import {
    request
} from './request'

export function getOrderList(query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr) {
    return request({
        url: 'orders',
        params: {
            query,
            pagenum,
            pagesize,
            user_id,
            pay_status,
            is_send,
            order_fapiao_title,
            order_fapiao_company,
            order_fapiao_content,
            consignee_addr
        }
    })
}

export function getKuaidiInfo(){
    return request({
        url:'/kuaidi/1106975712662'
    })
}