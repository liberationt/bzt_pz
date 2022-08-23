import axios from 'axios'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from "@/utils/ruoyi";
import { saveAs } from 'file-saver'

let downloadLoadingInstance;

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
    // 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: process.env.VUE_APP_BASE_API,
    // 超时
    timeout: 60000
})

// request拦截器
service.interceptors.request.use(config => {

    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    // get请求映射params参数
    if (config.url.includes("/std-editor-api/") || config.url.includes("/std-editor-api/")) {
        config.baseURL = process.env.VUE_APP_EDITOR_PORT_URL_API;
        config.url = config.url.split("/std-editor-api")[1]
    } else if (config.url.includes("/std-es-search/") || config.url.includes("/std-es-search/")) {
        config.baseURL = process.env.VUE_APP_SEARCH_PORT_URL_API;
        config.url = config.url.split("/std-es-search")[1]
    } else if (config.url.includes("/process-api/")) {
        config.baseURL = process.env.VUE_APP_PROCESS_URL_API;
        config.url = config.url.split("/process-api")[1]
        if (config.method != 'POSTP' && config.method != 'postp') {
            config.headers['Content-Type'] = "application/x-www-form-urlencoded"
        }
        config.method = "post"

    } else if (config.method === 'get' && config.params) {
        let url = config.url + '?' + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
        //     // nodeServer接口
        // } else if (config.url && config.url.match(/\/nodedocument|\/file|\/office|\/struct|\/dbs/g)) {
        //     config.baseURL = process.env.VUE_APP_SERVER;
        //     // 新编辑器接口
        // } else if (config.url && config.url.match(/\/quoteSearch|\/outline|\/document|\/tag|\/lemma|\/editor/g)) {
        //     config.baseURL = process.env.VUE_APP_EDITOR_API;
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})


// 响应拦截器
service.interceptors.response.use(res => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode['default']
            // 二进制数据则直接返回
        if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
            return res.data
        }
        if (code === 401) {
            MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('LogOut').then(() => {
                    // location.href = '/login';
                    location.href = this.getConfigKey('oss.logOut.url')
                })
            }).catch(() => {});
            return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code === 500) {
            Message({
                message: msg,
                type: 'error'
            })
            console.log(msg)
            return Promise.reject('error')
        } else if (code == 501 && res.config.url == '/template/updateTemplate') {
            return res.data
        } else if (code !== 200) {
            Notification.error({
                title: msg
            })
            return Promise.reject('error')
        } else {
            return res.data
        }
    },
    error => {
        console.log('err' + error)
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        Message({
            message: message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

// 通用下载方法
export function download(url, params, filename) {
    downloadLoadingInstance = Loading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
    return service.post(url, params, {
        transformRequest: [(params) => { return tansParams(params) }],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'blob'
    }).then(async(data) => {
        const isLogin = await blobValidate(data);
        if (isLogin) {
            const blob = new Blob([data])
            saveAs(blob, filename)
        } else {
            Message.error('无效的会话，或者会话已过期，请重新登录。');
        }
        downloadLoadingInstance.close();
    }).catch((r) => {
        console.error(r)
        Message.error('下载文件出现错误，请联系管理员！')
        downloadLoadingInstance.close();
    })
}

// 通用下载方法 POST
export function downloadByPost(url, params, filename) {
    downloadLoadingInstance = Loading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
    return service.post(url, params, {
        responseType: 'blob'
    }).then((data) => {
        const content = data
        const blob = new Blob([content], { type: "application/vnd.ms-excel" })
        if ('download' in document.createElement('a')) {
            const elink = document.createElement('a')
            elink.download = filename
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href)
            document.body.removeChild(elink)
        } else {
            navigator.msSaveBlob(blob, filename)
        }
        downloadLoadingInstance.close();
    }).catch((r) => {
        console.error(r)
        downloadLoadingInstance.close();
    })
}

// 通用下载方法 GET
export function downloadByGet(url, params, filename) {
    downloadLoadingInstance = Loading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
    return service.get(url, { params: params }, {
        headers: { 'Content-Type': 'application/json' },
        responseType: "blob"
    }).then((data) => {
        const content = data
        const blob = new Blob([content], { type: 'application/vnd.ms-excel' })

        if ('download' in document.createElement('a')) {
            const elink = document.createElement('a')
            elink.download = filename
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href)
            document.body.removeChild(elink)
        } else {
            navigator.msSaveBlob(blob, filename)
        }
        downloadLoadingInstance.close();
    }).catch((r) => {
        console.error(r)
        downloadLoadingInstance.close();
    })
}

export default service