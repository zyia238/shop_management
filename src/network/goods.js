import {
    request
} from './request'

export function getGoodsList(type, pagenum, pagesize) {
    return request({
        url: '/categories',
        params: {
            type,
            pagenum,
            pagesize
        }
    })
}

export function addGoodsCate(cat_pid, cat_name, cat_level) {
    return request({
        url: '/categories',
        method: 'post',
        data: {
            cat_pid,
            cat_name,
            cat_level
        }
    })
}

export function addParentsGoodsList() {
    return request({
        url: '/categories',
        params: {
            type: 2
        }
    })
}

export function addAllParentsGoodsList() {
    return request({
        url: '/categories'
    })
}

export function getParamsList(id, sel) {
    return request({
        url: 'categories/' + id + '/attributes',
        params: {
            sel
        }
    })
}

export function addParams(id, attr_name, attr_sel) {
    return request({
        url: 'categories/' + id + '/attributes',
        method: 'post',
        data: {
            attr_name,
            attr_sel
        }
    })
}

export function queryParams(id, attr_id, attr_sel) {
    return request({
        url: 'categories/' + id + '/attributes/' + attr_id,
        params: {
            attr_sel
        }
    })
}

export function editParams(id, attr_id, attr_name, attr_sel) {
    return request({
        url: 'categories/' + id + '/attributes/' + attr_id,
        method: 'put',
        data: {
            attr_sel,
            attr_name
        }
    })
}

export function addParamsTags(id, attr_id, attr_name, attr_sel, attr_vals) {
    return request({
        url: 'categories/' + id + '/attributes/' + attr_id,
        method: 'put',
        data: {
            attr_sel,
            attr_name,
            attr_vals
        }
    })
}


export function deleteParams(id, attr_id) {
    return request({
        url: 'categories/' + id + '/attributes/' + attr_id,
        method: 'delete'
    })
}

export function getNewGoodsList(query, pagenum, pagesize) {
    return request({
        url: '/goods',
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

export function deleteGoods(id) {
    return request({
        url: '/goods/' + id,
        method: 'delete'
    })
}

export function addGoodsConfirm(goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs) {
    return request({
        url: '/goods',
        method: 'post',
        data: {
            goods_name,
            goods_cat,
            goods_price,
            goods_number,
            goods_weight,
            goods_introduce,
            pics,
            attrs
        }
    })

}