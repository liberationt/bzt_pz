import request from '@/utils/request';
const batchApi = process.env.VUE_APP_EDITOR_PORT_URL_API

/* if(process.env.NODE_ENV !== 'development'){
    protocal = process.env.VUE_APP_EDITOR_URL;
}
 */
/**
 * @description 新增内容模板配置
 * @param {Object}  data { tmplId:"", tmplType:0, content:""}
 */
export function addContentTemplate(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/contentTemplate',
            method: 'post',
            data: data
        })
        resolve(response);
    })
}

/**
 * @description 修改内容模板配置
 * @param {Object}  data { tmplId:"", tmplType:0, content:""}
 */
export function editContentTemplate(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/contentTemplate',
            method: 'put',
            data: data
        })
        resolve(response);
    })
}

/**
 * @description 获取内容模板配置列表
 * @param {Object}  data { }
 */
export function listContentTemplate(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/contentTemplate/list',
            method: 'post',
            data: data
        })
        resolve(response);
    })
}

/**
 * @description 获取文档标签设置列表
 * @param {Object}  data { }
 */
export function listTempTags(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/contentTemplateTag/list',
            method: 'post',
            data: data
        })
        resolve(response);
    })
}

/**
 * @description 新增文档标签设置列表
 * @param {Object}  data { }
 */
export function addTempTags(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/contentTemplateTag',
            method: 'post',
            data: data
        })
        resolve(response);
    })
}

/**
 * @description 修改文档标签设置列表
 * @param {Object}  data { }
 */
export function editTempTags(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/contentTemplateTag',
            method: 'put',
            data: data
        })
        resolve(response);
    })
}


// 搜索题录信息
export function quoteSearchStandard(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/quoteSearch/standard',
            method: 'post',
            data: data
        })
        resolve(response);
    })
}

// 搜索术语信息
export function lemmaList(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/lemma/list',
            method: 'post',
            data: data
        })
        resolve(response);
    })
}
// 新增征求意见
export function opinionAdd(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/editor/opinion',
            method: 'post',
            data: data
        })
        resolve(response);
    })
}

// 更新征求意见
export function opinionUpdate(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/editor/opinion',
            method: 'put',
            data: data
        })
        resolve(response);
    })
}

// 征求意见列表
export function opinionList(data={}) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi+'/editor/opinion/list',
            method: 'post',
            data: data
        })
        resolve(response);
    })
}
