import { toActions } from "@/utils/httpAction"

/**
 * @param 传值为要调用的接口的API
 * @desc 格式为 POST api/getInfo
 * @author wry 2021.12.04
 */
export default toActions({
    login: "POST /login", // 登录
    logout: "POST /logout", // 退出登录
    logoutSSO: "POST /logoutSSO", // 退出登录
    getInfo: "GET /getInfo", // 获取用户信息
})