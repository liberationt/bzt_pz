import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import 'font-awesome/css/font-awesome.min.css' // fontAwesome
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download, downloadByPost } from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { getUrlKey, hasPermission, noPermi, parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree, filterDetailParam, checkCardNo, haveCNChars, isEmail, deepClone, setTaskStatusStyle } from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
import TinymceEditor from "@/components/tinymceEditor"


// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'
// echarts组件
import * as echarts from 'echarts'

// bus
import $bus from "@/utils/bus";
// loadding
import { Loading } from 'element-ui'

// 根据文件链接下载文件
import { downLoadFileByURL } from "@api/fileUpload";

// 导出无需重命名的文件流
import { XHRDownloadFile, downLoadByURL } from "@utils/export";

// 编辑器工具类
import editorUtils from '@utils/editorUtils';

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.downloadByPost = downloadByPost
Vue.prototype.handleTree = handleTree
Vue.prototype.$echarts = echarts
Vue.prototype.filterDetailParam = filterDetailParam
Vue.prototype.checkCardNo = checkCardNo
Vue.prototype.haveCNChars = haveCNChars
Vue.prototype.isEmail = isEmail
Vue.prototype.deepClone = deepClone
Vue.prototype.setTaskStatusStyle = setTaskStatusStyle
Vue.prototype.$bus = $bus
Vue.prototype.Loading = Loading
Vue.prototype.hasPermission = hasPermission
Vue.prototype.downLoadFileByURL = downLoadFileByURL
Vue.prototype.downLoadByURL = downLoadByURL
Vue.prototype.noPermi = noPermi
Vue.prototype.getUrlKey = getUrlKey

Vue.prototype.XHRDownloadFile = XHRDownloadFile

Vue.prototype.$editorUtils = editorUtils;


// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('TinymceEditor', TinymceEditor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

// js工具库
import lodash from 'lodash'
if (process.server) {
    global._ = lodash;
} else {
    window._ = lodash;
}

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
})


/**
 * 新增：与新编辑器相关
 */
// iconfont字体图标库
// import '@/assets/iconfont/iconfont.css';
// import '@/plugins/global.js';
// import '@/plugins/moment.js';
// import '@/plugins/storage.js';

/**
 * 新编辑器相关
 */
import { samEditor } from "sam-editor";
// import "../lib/sam-editor/index/style.css";
// Vue.component(samEditor.name, samEditor);
Vue.use(samEditor)

// /**
//  * 动态流程引擎相关组件
//  */

// import { FlowEditor } from "../lib/workflow/s-flow-editor/index";
// Vue.use(FlowEditor)


Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})