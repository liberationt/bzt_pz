import { toActions } from "@/utils/httpAction"

/**
 * 我的草案相关API
 * @param 传值为要调用的接口的API
 * @desc 格式为 POST api/getInfo
 * @author wry 2021.12.24
 */
export default toActions({
    getDraftList: "POST /system/personDraft/list", // 获取个人草案列表
    getDraft: "GETS /system/personDraft", // 获取草案信息
    addDraft: "POST /system/personDraft", // 新增个人草案
    removeDraft: "DELETES /system/personDraft", // 删除个人草案
    updateDraft: "PUT /system/personDraft", // 修改个人草案

})