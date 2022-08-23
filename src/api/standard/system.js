import request from '@/utils/request'

/**
 * -----------------------标准体系---------------------------
 */
// 标准体系列表
export function listStdSystem(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: '/standard/system/list',
            method: 'post',
            data:data
        })
        resolve(response)
    })
}

// 标准体系详细
export function getStdSystem(id) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: '/standard/system/' + id,
            method: 'get'
        })
        resolve(response)
    })
}
// 删除标准体系
export function deleteStdSystem(id) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: '/standard/system/' + id,
            method: 'delete'
        })
        resolve(response)
    })
}
// 新增标准体系
export function addStdSystem(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: '/standard/system',
            method: 'post',
            data:data
        })
        resolve(response)
    })
}
// 更新标准体系
export function updateStdSystem(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: '/standard/system',
            method: 'put',
            data:data
        })
        resolve(response)
    })
}

// 生成体系绑定标准数量图标数据 
export function quantityicon () {
    return new Promise((resolve, reject) => {
        let response = request({
            url: `/standard/system/buildSystemBindCountCharts`,
            method: 'get'
        })
        resolve(response)
    })
}
// 体系流程进度变化
export function processChange(data){
    return new Promise((resolve, reject) => {
        let response = request({
            url: `/standard/system/processChange`,
            method: 'post',
            data: data
        })
        resolve(response)
    })
}