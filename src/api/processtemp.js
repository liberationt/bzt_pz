import { toActions } from "@/utils/httpAction"
const baseApi = process.env.VUE_APP_PROCESS_URL_API

/**
 * 流程模板相关API
 * @param 传值为要调用的接口的API
 * @desc 格式为 POST api/getInfo
 * @author wry 2022.03.03
 */
export default toActions({
    setWFTemplate: `POSTB ${baseApi}/template/setWFTemplate`, // 复制保存流程模板
    updateTemplate: `POSTB ${baseApi}/template/updateTemplate`, // 更新流程模板
    getWFTemplateList: `POSTB ${baseApi}/template/getWFTemplateList`, // 查询流程模板列表
    getWFTemplate: `POSTB ${baseApi}/template/getWFTemplate`, // 查询流程模板信息


    addApiCode: `POSTB ${baseApi}/code/addApiCode`, // 新建Api-code
    editApiCode: `POSTB ${baseApi}/code/editApiCode`, // 编辑Api-code
    getApiCodeList: `POSTB ${baseApi}/code/getApiCodeList`, // Api-code列表
    getCode: `postu ${baseApi}/code/getApiCode`, // 获取Api-code详细信息
    runApiCode: `POSTS ${baseApi}/code/runApiCode`, // 运行Api-code

    // 动态流程
    getWFTemplateListJson: `POSTB ${baseApi}/template/getWFTemplateListJson`, // 流程应用模板

    checkJsonContent: `POSTP ${baseApi}/template/checkJsonContent`, // 检测模板合规性
})