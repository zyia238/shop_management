import {
    request
} from './request'

export function getReportDiagram(){
    return request({
        url:'reports/type/1'
    })
}