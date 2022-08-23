import { toActions } from "@/utils/httpAction"

/**
 * 流程相关API
 * @param 传值为要调用的接口的API
 * @desc 格式为 POST api/getInfo
 * @author wry 2021.12.04
 */
export default toActions({
    /*** ****************************** 根据wf_def_id获取该流程各节点信息 ********************************************** */
    getProcessNodeList: "GETS /scplat/activityDef/getNodesByWfDefId", // 根据wf_def_id获取该流程各节点信息
    getProcessNodeOutList: "GETS /scplat/activityDef/getNodesByWfDefIdOut", // 根据wf_def_id获取该流程各节点信息

    getAttachmentFile: "GET /scplat/attachmentFile/list", // 查看附件 

    getFileListByProjectWfType: "POST /scplat/attachmentFile/getFileListByProjectWfType", // 过程文件

    getProjectApprovalListAll: "POST /scplat/projectApproval/listAll", // 企业制修订（立项）全部

    /* ——————————————————————————— 外部征求意见 ————————————————————————————————— */
    getGKDWList: "GET /system/dict/data/type/technical_committees", // 获取任务归口单位列表
    getTaskCheckList: "GET /system/user/selectUserByRoleKeys", // 任务可选择成员列表
    adviceCollectingTaskList: "GET /scplat/adviceCollectingTask/list", // 外部征求意见列表
    addAdviceCollectingTask: "POST /scplat/adviceCollectingTask/add", // 创建外部征求意见任务
    adviceCollectingTaskAssignList: "GET /scplat/AdviceCollectingStandardTask/list", // 征求意见项目列表

    addAdviceCollectingFileDownload: "GET /scplat/attachmentFile/downloadByTypeAndId", // 外部征求意见项目一键下载附件
    removeAdviceCollectingTask: "DELETES /scplat/adviceCollectingTask", // 外部征求意见删除任务
    addStdAdvice: "POST /scplat/adviceCollectingTaskAssign/add", // 添加标准
    addPersonnelAdvice: "POST /scplat/adviceCollectingTaskAssign/addPersonnel", // 分配人员
    updateAdviceCollectingTaskAssign: "PUT /scplat/adviceCollectingTaskAssign", // 上传附件，编辑
    stdDownloadAll: "GET scplat/adviceCollectingTaskAssign/downloadById", // 外部征求意见标准一键下载
    getScpProjectApprovalWithScplat: "GETS /scplat/project/getScpProjectApprovalWithScplat", // 获取企业征求意见详情
    adviceCollectingTaskAssign: "PUT /scplat/adviceCollectingTaskAssign", // 编辑，子公司，处理人员，负责人上传文件
    companyUpload: "POST /scplat/adviceCollectingTaskAssign/companyUpload", // 上传意见汇总表
    downloadById: "GET /scplat/adviceCollectingTaskAssign/downloadById", // 列表除第一节点一键下载
    getFileByAdministrators: "POST /scplat/adviceCollectingTaskAssign/getFileByAdministrators", // 查看结果，下载也可用
    downloadSolicitOpinionsWord: "GET /scplat/adviceCollectingTaskAssign/downloadSolicitOpinionsWord", //下载导出汇总表
    AdviceTaskEnd: "POST /scplat/AdviceCollectingStandardTask/AdviceTaskEnd", // 任务结束
    queryFile:"POST /scplat/adviceCollectingTaskAssign/list2", //查询下载文件
    findUserIdByTaskId: "GET /scplat/adviceCollectingTaskAssign/findUserIdByTaskId", // 查询已分配人员
    selectAssignByProcessAs: "GET /scplat/adviceCollectingTaskAssign/selectAssignByProcessAs", // 拿到所有的标准化负责人
    getChildProcessNodes: "GET /scplat/adviceCollectingTaskAssign/scplatAdviceStateDetails", //获取子流程节点信息
    updateIsOverByTaskId: "GET /scplat/AdviceCollectingStandardTask/updateIsOverByTaskId", // 任务添加标准完成
    isSendOut: "GET /scplat/projectApproval/isSendOut", // 判断立项通知的项目是否已全部到起草通知
    standardTask:"GET /system/ScpAdviceCollectingOpinion/list",
    setOpinion:"POST /system/ScpAdviceCollectingOpinion/addList", //征求意见暂存


    /****************************** 制修订 ******************************* */
    enReviseList: "POST /scplat/project/list", // 获取企业制修订列表
    getProNodesByPhase: "GETS /scplat/project/getProjectNodesByPhase", // 根据项目阶段获取节点
    setACtionUser: "POST /scplat/project/distributeTask", // 标准第一起草人在线分配任务:选择其他起草人/选择征求意见人员
    enFfinishedDraft: "PUTU /scplat/project/finishedDraft", // 企业第一起草人形成草案稿/送审稿/报批稿
    outFfinishedDraft: "PUTU /scplat/project/finishedDraftOut", // 外部第一起草人形成草案稿/送审稿/报批稿

    enReviewDraft: "POST /scplat/project/reviewDraft", // 标准化审核草案稿/送审稿/报批稿
    outReviewDraft: "POST /scplat/project/reviewDraftOut", // 标准化审核草案稿/送审稿/报批稿
    enStdCountersignature: "POST /scplat/project/stdCountersignature", // 标准会签
    enDeptReview: "POST /scplat/project/deptReview", // 第一起草人部门分管领导批准/公司分管领导批准
    enDeptAudit: "POST /scplat/project/approvedBy", // 1119审核

    enUploadMeetingFile: "POST /scplat/project/uploadMeetingFile", // 上传审查会会议纪要
    enNeedMeetingUnderLine: "POST /scplat/project/needMeetingUnderLine", // 标准化主管审核，决定是否组织线下审查会
    stdPublish: "POST /scplat/project/stdPublish", // 标准发布
    forAdvice: "POST /scplat/project/forAdvice", // 提交征求意见
    getOutProNodesByPhase: "GETS /scplat/project/getProjectNodesByPhaseOut", // 获取外部制修订节点信息

    createReviseProject: "POST /scplat/project/createReviseProject", // 创建外部标准
    sendDocToApprove: "GETS /scplat/project/sendDocToApprove/", // 标准化上报
    deliverOutsideFeedbackToDoc: "POST /scplat/project/deliverOutsideFeedbackToDoc", // 标准化业务人员在系统中更新反馈结果
    distributeProject: "POST /scplat/project/distributeProject", // 分发项目
    delProject: "DELETES /scplat/project/delProject", // 删除项目
    editProject: "PUT /scplat/project", // 更新制修订

    resolveTimeRange: "POST /scplat/project/resolveTimeRange", // 修改制修订草案编写以及征求意见的时间范围
    changeMyDistribute: "POST /scplat/project/changeMyDistribute", // 修改起草人/修改征求意见人员

    withdrawWF: "POST /scplat/project/withdrawWF", // 制修订撤回

    updateStdCover: "PUT /scplat/project/updateStdCover", // 制修订更新标准封面

    distributeMainEdit: "POST /scplat/project/distributeMainEdit", // 外部制修订选择第一起草人

    choiceReviewedBy: "POST /scplat/project/choiceReviewedBy", //选择评审人
    opinionIsEnd: "GET /scplat/opinionFinishList/isEnd",

    /********************************** 征求意见 ******************************************* */
    addOpinion: "POST /scplat/opinionComment", ///创建征求意见
    updateOpinion: "PUT /scplat/opinionComment", ///创建征求意见
    getOpinionList: "POST /scplat/opinionComment/list", // 查询征求意见列表
    getOpinionDetail: "GETS /scplat/opinionComment", // 查询征求意见详情
    removeOpinion: "DELETES /scplat/opinionComment", // 删除征求意见
    addOpinionFinishList: "POST /scplat/opinionFinishList", ///创建征求意见完成人员
    getOpinionFinishList: "POST /scplat/opinionFinishList/list", ///查询征求意见完成人员列表

    /********************************** 标准立项 ******************************************* */
    addProjectApproval: "POST /scplat/projectApproval", ///创建项目
    updateProjectApproval: "PUT /scplat/projectApproval", // 修改立项项目
    getProjectApprovalList: "POST /scplat/projectApproval/list", // 查询立项项目列表
    getProjectApprovalDetail: "GETS /scplat/projectApproval", // 查询立项项目详情
    removeProjectApproval: "DELETES /scplat/projectApproval", // 删除立项项目
    exportProjectApprovalSummaryFile: "GET /scplat/projectApproval/exportSummaryFile", //导出立项申请汇总表
    importFileByDept: "POST /scplat/projectApproval/importFileByDept", // 上传会议纪要
    selectedInterfacePerson: "POST /scplat/projectApproval/selectedInterfacePerson", // 选择标准化对接人
    reportProjectProgress: "POSTU /scplat/projectApproval/reportProjectProgress", // 项目进度表审核
    infoPublish: "POST /scplat/infoPublish", // 发布标准编制工作通知
    exportPlanSummaryFile: "POST /scplat/exportPlanSummaryFile", // 导出制修订计划总表
    updateFinalReviewResults: "POST /scplat/projectApproval/updateFinalReviewResults", // 更新最终评审结果
    getInfoPublishUser: "GETS /scplat/projectApproval/getInfoPublishUser", // 获取指定阶段的信息发布人（第一起草人)
    checkProjectNameUnique: "GET /scplat/projectApproval/checkProjectNameUnique", // 校验项目名称是否唯一
    checkFinalReviewUser: "GETS /scplat/projectApproval/checkFinalReviewUser", // 验证最终评审结果的操作用户权限
    projectApplicationReview: "POST /scplat/projectApproval/projectApplicationReview", // 立项申请在线评审（部门级评审/公司级评审 在线评审接口）

    addSpecialProjectApproval: "POST /scplat/projectApproval/submitSpecialProjectApplication", // 特殊立项申请
    auditSpecialProjectApplication: "POST /scplat/projectApproval/auditSpecialProjectApplication", // 审核特殊立项申请
    updateSpecialProjectApproval: "PUT /scplat/projectApproval", // 特殊立项修改

    checkWidthDrawAuth: "GETS /scplat/projectApproval/checkWidthDrawAuth", // 验证用户是否有撤回权限
    withDrawById: "POSTU /scplat/projectApproval/withDrawById", // 根据项目id撤回流程


    /*************************************  标准购置 ******************************************************** */
    applyStdLiaisonApplyOnline: "POST /scplat/purchase/startScpStdPurchase", // 申请标准购置
    stdLiaisonApplyOnlineByBusinessId: "GETS /scplat/purchase/stdLiaisonApplyOnline", // 各部门标准化网员在线申请
    stdLiaisonReview: "POST /scplat/purchase/stdLiaisonReview", // 标准化业务人员/部门分管领导/科技管理部分管领导审核
    completeScpStdPurchase: "POST /scplat/purchase/completeScpStdPurchase", // 完成标准购置
    updateStdLiaisonApplyOnline: "PUT /scplat/purchase/edit", // 修改购置表单
    getPurchaseDetail: "GETS /scplat/purchase", // 获取购置详情
    getPurchaseList: "POST /scplat/purchase/list", // 标准购置列表
    removePurchase: "DELETES /scplat/purchase/delProject", // 删除一个标准购置项目
    getPurSdList: "GET /scplat/ScpStdPurchaseApplay/getUploadStandard", //获取审核通过的外部自定义购置标准
    serialNumber: "GET /scplat/purchase/serialNumber", // 获取标准购置流水
    checkPurchase: "GET /scplat/ScpStdPurchaseApplay/checkPurchase", // 检测标准是否已被购置

    /************************************* 企业复审  ********************************************************** */
    // addRwTask: "POST /scplat/RwTask", // 发起复审任务
    getRwTaskList: "GET /scplat/RwTask/list", // 企业复审列表
    getRwTaskListOut: "GET /scplat/RwTask/listOut", // 外部复审列表
    removeRwTask: "DELETES /scplat/RwTask", // 移除复审任务
    getStdList: "GET /scplat/stdlist/list", // 获取复审任务可选项目
    addRwTask: "POST /scplat/RwTaskStandardDetail", // 添加(复审任务)项目
    examineTask: "POST /scplat/RwTask/examineTask", // 第二三步审核,最后一步审核
    distributePersonnel: "POST /scplat/RwTask/distributePersonnel", // 分配网员
    distributionHandler:"POST /scplat/RwTask/distributionHandler", //复审分配网员
    exportExcelTemplate: "POST /scplat/RwTaskStandardDetail/exportExcelTemplate", // 标准化网员导出汇总表
    importOpinion: "POST /scplat/RwProcessorTaskOpinion/importOpinion", // 网员上次会议纪要
    leaderExamine: "POST /scplat/RwProcessorTaskAssign/leaderExamine", // 标准化网员分管领导审核
    leaderExamineNew:"POST /scplat/RwProcessorTaskAssign/leaderExamineNew",

    choiceLeader:"POST /scplat/RwProcessorTask/choiceLeader", 
    getRwProcessorTask:"GETS /scplat/RwProcessorTask",
    leaderExamineHandle:"POST /scplat/RwProcessorTask/leaderExamine",
    importDetail: "POST /scplat/RwTaskStandardDetail/importDetail", // 标准化业务人员上传
    rwProcessorTaskAssignList: "GET /scplat/RwProcessorTaskAssign/list", // 起草通知拿到附件
    updateRwTask: "PUT /scplat/RwTask", // 起草通知
    getRwProjectListByTaskId: "GET /scplat/RwTaskStandardDetail/list", // 项目列表
    getStdListByDetail:"GET /scplat/RwTaskStandardDetail/getStdListByDetail", //外部项目列表
    listByTaskId: "GET /scplat/RwProcessorTaskOpinion/listByTaskId", // 通过复审ID查询所有人的复审情况
    examineRwTast:"PUT /scplat/RwTask", //复审第一步审核
    findProcess:"GET /scplat/RwProcessorTask/findProcessById", //进度
    findCurrentHandler:"GET /scplat/RwTask/findCurrentHandler",

    findStandardByTaskId:"GET /scplat/RwTaskStandardDetail/findStandardByTaskId", //查询复审相关信息
    getSendContent:"GET /scplat/RwTaskStandardDetail/getSendContent", //起草复审通知相关查询

    /**************************************************  标准资料管理  ************************************************** */
    addDocType: "POST /system/type/addDocType", // 新增标准资料目录
    delDocType: "DELETES /system/type/delDocType", // 移除标准资料目录
    docTypeList: "POST /system/type/list", // 标准资料目录列表查询    
    addDoc: "POST /system/doc/addDoc", // 新增资料信息
    delDoc: "DELETES /system/doc/delDoc", // 删除标准资料信息
    getDocList: "POST /system/doc/getList", // 查询标准资料列表

    /**************************************** 流程通用接口 ************************************************************ */
    // checkRejectReason: "POST /scplat/opinion/list", // 查询驳回意见记录列表
    checkRejectReason: "POST /scplat/opinion/getPageList", // 查询驳回意见记录列表
    getStdPurchaseHistory:"GETS /scplat/purchase/getStdPurchaseHistory", //查询驳回节点


    /********************************************   采购（标准）申请     ************************************************** */
    getPurchaseByUserId: "GET /scplat/ScpStdPurchaseApplay/getPurchaseByUserId", // 查询当前用户购买中或者购买成功的标准
    getStdPurchaseInfoById: "GETS /scplat/ScpStdPurchaseApplay", // 根据ID获取采购信息
    applyStdPurchase: "POST /scplat/ScpStdPurchaseApplay", // 采购申请
    aduitStdPurchase: "PUT /scplat/ScpStdPurchaseApplay", // 审核采购申请
    stdPurchaseList: "GET /scplat/ScpStdPurchaseApplay/list", //我的采购记录、流程查询审核通过的标准
    updateStdPurchaseState: "GETS /scplat/ScpStdPurchaseApplay/update", // 采购流程启动调用


    /***************************************   企业标准资料管理    ******************************************************* */
    addTopicAndReplace: "POST /scplat/stdlist/addTopicAndReplace", // 自定义上传标准
    importTopics: "POST /scplat/stdlist/importTopics", // 批量导入
    updateTopic: "POST /scplat/stdlist/updateTopic", // 修改标准资料
    updateModifyFileById: "GET /scplat/stdlist/updateModifyFileById", // 删除修改单


    /********************************   任务专办  ************************************* */
    taskTransfer: "GET /system/todoTask/transferToDoTask", // 转办
    getUserOfNode: "GET /system/todoTask/getUserByHook", // 获取当前节点所有操作用户

    /**********************************  离线更新 ************************************************ */
    offLineList: "GET /scplat/StdUpdateLog/list", // 列表


    /************************************** 投票任务  ********************************************* */
    getVoteList: "GET /scplat/scpVote/list", // 投票任务列表
    createVote: "POST /scplat/scpVote", // 创建投票任务
    getProjectByVoteId: "GET /scplat/scpVote/getProjectByVoteId", // 投票详情
    expertCastVote: "POST /scplat/scpVoteDetail", // 专家投票
    voteProList: "POST /scplat/projectApproval/voteList", // 获取需要投票的项目
    jumpVote: "POST /scplat/scpVote/skipVote", // 跳过投票
    stopVote: "GET /scplat/scpVote/stopVote", // 终止投票
    checkVote: "GET /scplat/scpVoteDetail/findVoteByVoteId", // 查看投票结果
    giveUpVote: "POST /scplat/scpVoteDetail/giveUpVote", // 放弃投票


    /************************************** 标准发布  ********************************************* */

    getStandard: "GET /scplat/project/scplatSerialNumber", // 放弃投票

    /************************************** 新外部立项  ********************************************* */

    setProgressTime:"POST /scplat/project/setPreparationProgressTime",  //制定编制进度时间
    setAssemblyTime:"POST /scplat/project/setPreparedBy",  //组建编制组
    setExamin:"POST /scplat/project/standardizationExamine",   //标准化审核
    uploadFile:"POST /scplat/project/uploadRelatedMaterials",   //上传相关文件
    uploadRelatedMaterials:"GET /scplat/project/generateManuscript",    //生成稿件
    organizationalMeeting:"POST /scplat/project/organizationalMeeting",  //组织会议
    getSelectVersion:"GET /scplat/attachmentFile/selectVersion",    //获取当前版本

    setExternalReview:"POST /scplat/projectApproval/externalReview",  //外部立项 标准化业务人员审核
})