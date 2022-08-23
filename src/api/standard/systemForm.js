import request from '@/utils/request'

/**
 * -----------------------标准体系编制说明---------------------------
 */
// 新增标准体系表单
export function addSystemForm(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemForm',
          method: 'post',
          data:data
      })
      resolve(response)
  })
}
// 修改标准体系表单
export function updateSystemForm(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemForm',
          method: 'put',
          data:data
      })
      resolve(response)
  })
}
// 修改标准体系表单
export function getSystemForm(id) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemForm/' + id,
          method: 'get'
      })
      resolve(response)
  })
}

// 标准体系表单列表
export function listSystemForm(data) {
  return new Promise((resolve, reject) => {
      let response = request({
          url: '/standard/systemForm/list',
          method: 'post',
          data:data
      })
      resolve(response)
  })
}