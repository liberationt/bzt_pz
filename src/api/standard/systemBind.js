import request from '@/utils/request'

/**
 * -----------------------标准体系绑定标准---------------------------
 */
// 新增标准体系绑定
export function addSystemBind(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemBind',
          method: 'post',
          data: data
      })
      resolve(response)
  })
}
// 修改标准体系绑定
export function updateSystemBind(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemBind',
          method: 'put',
          data: data
      })
      resolve(response)
  })
}
// 获取标准体系绑定详细信息
export function infoSystemBind(id) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemBind/' + id,
          method: 'get'
      })
      resolve(response)
  })
}
// 删除标准体系绑定详细信息
export function deleteSystemBind(id) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemBind/' + id,
          method: 'delete'
      })
      resolve(response)
  })
}
// 查询标准体系绑定列表
export function listSystemBind(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemBind/list',
          method: 'post',
          data: data
      })
      resolve(response)
  })
}
// 根据nodeID查询标准体系绑定列表
export function listSystemBindByIds(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemBind/listByIds',
          method: 'post',
          data: data
      })
      resolve(response)
  })
}

// 查询标准体系绑定列表(企业框图)
export function countSystemBindById(id) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemBind/countByNodeId/' + id,
          method: 'get'
      })
      resolve(response)
  })
}


// 获取体系节点下绑定的所有标准
export function getMaxNumebrByNodeId(nodeId) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemBind/getMaxNumebrByNodeId/' + nodeId,
          method: 'get'
      })
      resolve(response)
  })
}

// 批量新增标准体系绑定
export function batchAddSystemBind(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemBind/batch',
          method: 'post',
          data: data
      })
      resolve(response)
  })
}

// 标准统计
export function getNodeStdKindCount(nodeIdList) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: `/standard/systemBind/getNodeStdKindCount/${nodeIdList}`,
          method: 'get'
      })
      resolve(response)
  })
}

// 标准统计
export function getNodeStdCount(nodeIdList) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: `/standard/systemBind/getNodeStdCount/${nodeIdList}`,
          method: 'get'
      })
      resolve(response)
  })
}