import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


import { constantRoutes } from "./config"

export default new Router({
    mode: 'history', // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})