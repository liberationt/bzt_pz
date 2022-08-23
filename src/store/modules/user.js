import Api from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
        userInfo: null,
        loginFrom: 0, // 0:系统登陆； 1：单点登录
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        },
        SET_INFO: (state, info) => {
            state.userInfo = info
        },
        SET_LOGINFROM: (state, loginFrom) => {
            state.loginFrom = loginFrom
        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const req = {
                username: userInfo.username.trim(),
                password: userInfo.password,
                uuid: userInfo.uuid
            }
            return new Promise((resolve, reject) => {
                Api.login(req).then(res => {
                    console.log(res)
                    setToken(res.token)
                    commit('SET_TOKEN', res.token)
                    commit('SET_LOGINFROM', 0)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 单点登录TOKEN
        LoginSingle({ commit }, token) {
            return new Promise((resolve, reject) => {
                setToken(token)
                commit('SET_TOKEN', token)
                commit('SET_LOGINFROM', 0)
            })
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                Api.getInfo().then(res => {
                    const user = res.user
                    const avatar = user.avatar == "" || user.avatar == null ? null : process.env.VUE_APP_BASE_API + user.avatar;

                    commit('SET_INFO', res.user)
                    if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', res.roles)
                        commit('SET_PERMISSIONS', res.permissions)
                    } else {
                        commit('SET_ROLES', ['ROLE_DEFAULT'])
                    }
                    commit('SET_NAME', user.userName)
                    commit('SET_AVATAR', avatar)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 原有的退出登录
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                Api.logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_PERMISSIONS', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 退出系统（单点登录）
        // LogOut({ commit, state }) {
        //     return new Promise((resolve, reject) => {

        //         Api.logoutSSO(state.token).then(() => {
        //             commit('SET_TOKEN', '')
        //             commit('SET_ROLES', [])
        //             commit('SET_PERMISSIONS', [])
        //             removeToken()
        //                 // resolve()
        //         }).catch(error => {
        //             reject(error)
        //         })
        //     })
        // },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },
    }
}

export default user