import request from '@/utils/request'

/**
 * -----------------------标准体系节点---------------------------
 */
// 新增标准体系节点
export function addSystemNode(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemNode',
          method: 'post',
          data:data
      })
      resolve(response)
  })
}
// 更新标准体系节点
export function updateSystemNode(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemNode',
          method: 'put',
          data: data
      })
      resolve(response)
  })
}

// 获取所有体系节点数据
export function listAllSystemNode(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemNode/list',
          method: 'post',
          data: data
      })
      resolve(response)
  })
}

// 通过体系ID获取体系节点的树结构数据
export function listSystemNode(csmStdSystemId) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemNode/tree/' + csmStdSystemId,
          method: 'get'
      })
      resolve(response)
  })
}

// 删除标准体系节点
export function deleteSystemNode(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemNode/deleteByNodeIds',
          method: 'post',
          data: data
      })
      resolve(response)
  })
}

// 删除标准体系节点
export function infoSystemNode(id) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemNode/' + id,
          method: 'get'
      })
      resolve(response)
  })
}
// 编码顺序号 + 1
export function updateCodePulsOne(csmStdSystemNodeId) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemNode/updateCode/' + csmStdSystemNodeId,
          method: 'put'
      })
      resolve(response)
  })
}

// 递归更新节点树
export function recursionEditNodeTree(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemNode/recursionEdit',
          method: 'put',
          data: data
      })
      resolve(response)
  })
}

// 清除节点信息
export function clearNode(id) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemNode/clearNode/' + id,
          method: 'delete'
      })
      resolve(response)
  })
}
