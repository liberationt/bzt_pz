import request from '@/utils/request'
// const protocal = process.env.VUE_APP_EDITOR_PORT_URL;
const batchApi = process.env.VUE_APP_EDITOR_PORT_URL_API

/**
 * 编辑器相关接口-设置Object
 * @param {} data 
 * @returns 
 */

export function setConfigObject(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi + '/projectConfig/setConfigObject',
            method: 'post',
            data: data
        })
        resolve(response)
    })
}


/**
 * 编辑器相关接口-获取Object
 * @param {} data 
 * @returns 
 */

export function getConfigByKey(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi + '/projectConfig/getConfigByKey',
            method: 'post',
            data: data
        })
        resolve(response)
    })
}

/**
 * 编辑器相关接口-编辑草案
 * @param {} data 
 * @returns 
 */

export function updateByBusiness(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi + '/cover/updateByBusiness',
            method: 'put',
            data: data
        })
        resolve(response)
    })
}

/**
 * 编辑器相关接口-编辑草案
 * @param {} data 
 * @returns 
 */

export function toWordByBusinessId(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi + '/buildStd/toWordByBusinessId',
            method: 'POST',
            data: data
        })
        resolve(response)
    })
}

/**
 * 编辑器相关接口-获取大纲数据
 * @param {} data 
 * @returns 
 */

 export function listOutline(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: batchApi + '/outline/list',
            method: 'POST',
            data: data
        })
        resolve(response)
    })
}

/*--------------------提交记录---------------------*/

// 查询提交记录列表
export function listCommitRecord(query) {
    return new Promise((resolve, reject) => {
      let response = request({
        url: batchApi + '/commitRecord/list',
        method: 'post',
        data: query
      })
      resolve(response)
    })
  }
  
  // 查询提交记录详细
  export function getCommitRecord(id) {
    return new Promise((resolve, reject) => {
      let response = request({
        url: batchApi + '/commitRecord/' + id,
        method: 'get'
      })
      resolve(response)
    })
  }
  
  // 新增提交记录
  export function addCommitRecord(data) {
    return new Promise((resolve, reject) => {
      let response = request({
        url: batchApi + '/commitRecord',
        method: 'post',
        data: data
      })
      resolve(response)
    })
  }
  
  // 修改提交记录
  export function updateCommitRecord(data) {
    return new Promise((resolve, reject) => {
      let response = request({
        url: batchApi + '/commitRecord',
        method: 'put',
        data: data
      })
      resolve(response)
    })
  }
  
  // 删除提交记录
  export function delCommitRecord(ids) {
    return new Promise((resolve, reject) => {
      let response = request({
        url: batchApi + '/commitRecord/' + ids,
        method: 'delete'
      })
      resolve(response)
    })
  }

  
/*--------------------文档---------------------*/
  
// 查询文档列表
export function listDocument(query) {
  return new Promise((resolve, reject) => {
    let response = request({
      url: batchApi + '/document/list',
      method: 'post',
      data: query
    })
    resolve(response)
  })
}

// 查询文档详细
export function getDocument(id) {
  return new Promise((resolve, reject) => {
    let response = request({
      url: batchApi + '/document/' + id,
      method: 'get'
    })
    resolve(response)
  })
}

// 新增文档
export function addDocument(data) {
  return new Promise((resolve, reject) => {
    let response = request({
      url: batchApi + '/document',
      method: 'post',
      data: data
    })
    resolve(response)
  })
}

// 修改文档
export function updateDocument(data) {
  return new Promise((resolve, reject) => {
    let response = request({
      url: batchApi + '/document',
      method: 'put',
      data: data
    })
    resolve(response)
  })
}

// 删除文档
export function delDocument(ids) {
  return new Promise((resolve, reject) => {
    let response = request({
      url: batchApi + '/document/' + ids,
      method: 'delete'
    })
    resolve(response)
  })
}