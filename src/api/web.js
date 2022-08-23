import { toActions } from "@/utils/httpAction"

/**
 * 首页相关API
 * @param 传值为要调用的接口的API
 * @desc 格式为 POST api/getInfo
 * @author wry 2021.12.22
 */
export default toActions({
    indexChartpei: "GET /scplat/projectApproval/indexPieChartVo", // 首页饼图数据
    newsList: "GET /system/CmsArticle/noticeList", // 首页通知公告列表

    getArticleTypeList: "GET /system/CmsArticle/getArticleTypeList", // 获取内容分类
    articleList: "POST /system/CmsArticle/publishedList", // 获取内容列表
    getArticleDetail: "GETS /system/CmsArticle", // 内容发布的详情

    getServiceList: "GET /scplat/PzHomePage/listNotPage", // 获取服务入口菜单
    getMenuList: "GET /scplat/PzHomePage/getMenuByUserId", // 获取用户菜单权限
})