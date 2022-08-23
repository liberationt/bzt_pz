export { default as BreadCrumb }
from './model/breadCrumb' // 面包屑

export { default as Footer }
from './model/footer' // 底部

export { default as SearchBar }
from './model/searchBar' // 搜索表单列表

export { default as Screen }
from './model/screen' // 筛选组件

export { default as HomeHeader }
from './model/homeHeader' // web页面头部

export { default as HeaderSearch }
from './model/headerSearch' // web页面头部搜索

export { default as User }
from './model/user' // 头部用户信息

export { default as ViewProcess }
from './model/viewProcess' // 查看流程

export { default as PublicInfo }
from './model/publicInfo' // 信息发布（编辑，修改）

export { default as SelectUserByDept }
from "./model/selectUserByDept" // 根据部门选人


export { default as Notice }
from "./model/notice" // 消息通知提示

/*-------------------------标准体系---------------------------*/
export { default as SystemInfo }
from './stdSystem/systemInfo' // 体系详情

/*----------------------------- 信息发布审核，办理-------------------------------------- */
export { default as HandleInfo }
from "./model/handleInfo" // 信息发布审核/办理/详情

export { default as NoticeDistribution }
from "./model/noticeDistribution"

/******************************* 流程  ************************************** */
export { default as TecCommittees }
from "./model/process/tecCommittees" // 归口单位

export { default as ProInfo }
from "./model/process/proInfo" // 项目信息(企业立项流程)

export { default as SpecialProInfo }
from "./model/process/specialProInfo" // 特殊立项-项目信息

export { default as Predesc }
from "./model/process/predesc" // 编制说明

export { default as SchedulePlan }
from "./model/process/schedulePlan" // 标准编制进度计划

export { default as ProcessFiles }
from "./model/process/processFiles" // 过程文档

export { default as StdInfo }
from "./model/process/stdInfo" // 标准内容

export { default as ExProInfo }
from './model/process/exProInfo' // 项目信息(外部立项流程)


export { default as ProcessRejectReason }
from './model/process/processRejectReason' // 查看流程驳回终止原因


export { default as ProcessSignInfo }
from './model/process/processSignInfo' // 查看流程会签情况

/**************************** 标准立项（项目详情） *************************************** */
export { default as CheckFiles }
from "./model/checkFiles" // 查看附件

/*********************************  内容发布  ************************************** */
export { default as ContentPublish }
from "./model/contentPublish" // 内容发布
export { default as ContentUpdate }
from "./model/contentUpdate" // 内容更新

/************************************ 标准详情（标准查询，标准体系） ************************************ */
export { default as StdDetail }
from "./model/stdDetail" // 标准祥请查看

/************************************ 征求意见 ************************************ */
export { default as OpinionList }
from "./model/process/opinionList" // 征求意见列表
export { default as OpinionFinishDetail }
from "./model/process/opinionFinishDetail" // 征求意见情况

/************************************* 任务流程转办     ****************************** */
export { default as TransferToOther }
from './model/transferToOther'


/***************************** 流程应用编辑  ******************************88 */
export { default as WorkflowEditor }
from './workflowEditor/index'