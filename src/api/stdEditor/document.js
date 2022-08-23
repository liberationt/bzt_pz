import request from '@/utils/request';
let protocal = 'neweditor';
if(process.env.NODE_ENV !== 'development'){
    protocal = process.env.VUE_APP_REMOTE_API + '/neweditor';
}

// nodeServer服务
export function documentServer(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: protocal + '/nodedocument',
            method: 'post',
            data: data
        })
        resolve(response);
    })
}
// 上传文件
export function uploadFile(data) {
    return new Promise((resolve, reject) => {
        let response = request({
            url: protocal + '/file',
            method: 'post',
            data: data
        })
        resolve(response);
    })
}
