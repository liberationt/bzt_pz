import { toActions } from "@/utils/httpAction"
// VUE_APP_SEARCH_PORT_URL_API
const batchApi = process.env.VUE_APP_SEARCH_PORT_URL_API

/**
 * @param 传值为要调用的接口的API
 * @desc 格式为 POST api/getInfo
 * @author wry 2021.12.09
 */
export default toActions({

    /********************************** 标准查询 ********************************************* */
    getTopicaList: `POST ${batchApi}/rs/getTopicalList`, // 标准列表
    getTopicalDetail: `POST ${batchApi}/rs/getTopicalListWithModel`, // 根据model查询
    getTopicalListByStdId: `GETS ${batchApi}/rs/getTopicalListByStdId/`, // 根据STDID查询
    getStructureDataByStdId: `GETS ${batchApi}/rs/getStructureDataByStdId/`, // 根据stdId查询结构化数据
    getStructureDataByModel: `POST ${batchApi}/rs/getStructureDataByModel`, // 根据条件进行全文搜索
    searchFullText: `POST ${batchApi}/rs/searchFullText`, // 全文搜索

    getTopiclInfo: `GETS scplat/stdlist`, // 标准详情
    stdReadLog: "POST /scplat/StdReadLog", // 标准查询阅读记录
    stdReadLogList: "GET /scplat/StdReadLog/list", //阅读记录列表
    topicByStdId: "GET /scplat/StdReadLog/topicByStdId", // 记录信息



    /************************************** 收藏 ************************************************ */
    addFavorites: "POST /system/favorites", // 加入收藏
    removeFavorites: "DELETES /system/favorites", // 取消收藏
    getFavoritesList: "POST /system/favorites/list", // 收藏列表
    removeFavority: "POST /system/favorites/delFavorites", // 根据category和businessIds取消收藏
    getUserFavoriteBusinessIds: "GETS /system/favorites/getUserFavoriteBusinessIds", // 获取当前用户的收藏


    /******************************************** 消息通知 ************************************************* */
    getMessageList: "POST /system/message/getPageList", // 获取消息列表
    setMessageRead: "PUTS /system/message/setMessageRead", // 设置消息已读
    setMessageAllRead: "PUT /system/message/setMessageAllRead", // 设置消息已读
    listCountMessage: "GET /system/message/listCountMessage", // 查询消息数量

    readTask: "PUT /system/todoTask", // 待办已阅


    /******************************************** 信息发布 ******************************************************** */
    infoPublish: "POST /scplat/infoPublish", // 新增信息发布
    updatePublish: "PUT /scplat/infoPublish", // 修改信息发布
    infoPblicList: "POST /scplat/infoPublish/list", // 信息发布列表
    removeInfoPubilic: "DELETES /scplat/infoPublish", // 删除信息
    getInfoDetail: "GETS /scplat/infoPublish", // 查询信息发布详情
    auditInfo: "POST /scplat/infoPublish/audit", // 信息审核

    sendExternalApprovalNotic: "POST /scplat/infoPublish/sendExternalApprovalNotice", // 发送外部标准立项通知
    sendExternalScplatNotice: "POST /scplat/infoPublish/sendExternalScplatNotice", // 发送外部制修订通知
    receiverEnd: "GET /scplat/infoPublish/receiverEnd", //结束通知分发


    /***************************************** 内容发布  ************************************************************************ */
    getContentList: "POST /system/CmsArticle/list", //内容发布
    updateContent: "POST /system/CmsArticle/addOrEdit", // 新增修改内容发布
    updateArticleState: "POST /system/CmsArticle/updateApproveState", // 更新内容审核状态
    getArticleDetail: "GETS /system/CmsArticle", // 内容发布的详情
    removeArticle: "DELETES /system/CmsArticle", // 删除内容
    updateActivateState: "POST /system/CmsArticle/updateActivateState", // 停用启用


    /**********************************************  我参与的工作   ***************************************************** */
    getMyWork: "GET /system/user/myWork", // 我参与的工作


    /***********************************************   系统反馈意见     ********************************************** */
    updateFeedback: "POST /scplat/feedback/add", // 发布反馈意见
    removeFeedback: "DELETES /scplat/feedback", // 发布反馈意见
    getFeedbackList: "POST /scplat/feedback/list", // 发布反馈意见
    updateFeedBack: "PUT /scplat/feedback", // 修改反馈意见

    /*********************************************** 服务入口设置  **************************************************** */
    saveService: "POST /scplat/PzHomePage", // 保存服务入口
    getServiceList: "GET /scplat/PzHomePage/listNotPage", // 获取服务入口菜单
    getMenuList: "GET /scplat/PzHomePage/getMenuByUserId", // 获取管理员的所有菜单
    removeMenu: "DELETES /scplat/PzHomePage", // 移除服务入口

    updateFinalReviewResults: "POST /scplat/projectApproval/updateFinalReviewResults", // 更新最终评审结果
    
})