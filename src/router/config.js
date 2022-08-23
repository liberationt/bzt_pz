/* Layout */
import Layout from '@/layout'
import Empty from '@/layout/empty'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path(.*)',
            component: (resolve) => require(['@/views/redirect'], resolve)
        }]
    },
    // 首页
    {
        path: '',
        component: (resolve) => require(['@/views/web/home'], resolve),
        hidden: true
    },
    // 首页搜索
    {
        path: '/indexSearch',
        component: (resolve) => require(['@/views/web/indexSearch'], resolve),
        hidden: true
    },
    // 内容详情
    {
        path: '/articleDetail',
        component: (resolve) => require(['@/views/web/articleDetail'], resolve),
        hidden: true
    },
    // 查看内容
    {
        path: '/checkArticleDetail/:id',
        component: (resolve) => require(['@/views/web/contentDetail'], resolve),
        hidden: true
    },
    // pdf预览
    {
        path: '/pdfView',
        component: (resolve) => require(['@/views/web/pdfView'], resolve),
        hidden: true
    },
    /****************************** */
    {
        path: '/login',
        component: (resolve) => require(['@/views/login'], resolve),
        hidden: true
    },
    {
        path: '/register',
        component: (resolve) => require(['@/views/register'], resolve),
        hidden: true
    },
    {
        path: '/404',
        component: (resolve) => require(['@/views/error/404'], resolve),
        hidden: true
    },
    {
        path: '/401',
        component: (resolve) => require(['@/views/error/401'], resolve),
        hidden: true
    },
    // 编辑器
    {
        path: '/editor',
        component: Empty,
        hidden: true,
        children: [
            // 流程中编写文档
            {
                path: 'stdEidtorProcess/:docId/:id',
                component: (resolve) => require(['@/views/stdEditor/stdEidtorProcess'], resolve),
                name: 'stdEidtorProcess',
                meta: { title: '编辑标准', icon: 'dashboard', affix: false }
            },

        ]
    },
    // 工作台
    // {
    //     path: '/index',
    //     component: Layout,
    //     redirect: 'index',
    //     children: [{
    //         path: '',
    //         component: (resolve) => require(['@/views/index'], resolve),
    //         name: 'index',
    //         meta: { title: '工作台', icon: 'dashboard', affix: true }
    //     }]
    // },
    // 流程查看(内/外部制修订)
    {
        path: '/viewProcess/:businessType/:businessId/:projectPhase/:applyUser',
        component: Layout,
        hidden: true,
        children: [{
            path: '',
            component: (resolve) => require(['@/components/bussinessCom/model/viewProcess'], resolve),
            name: 'viewProcess',
            meta: { title: '流程查看', icon: 'dashboard', affix: false }
        }]
    },
    //  企业标准立项申请
    {
        path: '/work/enterpriseStdRevise/applyProject/:infoPublishId',
        component: Layout,
        hidden: true,
        children: [{
                path: '',
                component: (resolve) => require(['@/views/work/enterpriseStdRevise/components/applyProject'], resolve),
                name: 'applyProject',
                meta: { title: '企业标准立项申请', icon: 'dashboard', affix: false }
            },

        ]
    },
    //  特殊立项修改
    {
        path: '/work/enterpriseStdRevise/editSpecialProject/:id/:hook',
        component: Layout,
        hidden: true,
        children: [{
                path: '',
                component: (resolve) => require(['@/views/work/enterpriseStdRevise/components/applySpecialProject'], resolve),
                name: 'applySpecialProject',
                meta: { title: '特殊立项', icon: 'dashboard', affix: false }
            },

        ]
    },
    // 企业标准立项/特殊立项/制修订查看
    {
        path: '/work',
        component: Layout,
        hidden: true,
        children: [{
                path: 'enterpriseStdRevise/viewProject/:id/:projectPhase',
                component: (resolve) => require(['@/views/work/enterpriseStdRevise/components/projectDetail'], resolve),
                name: 'viewProject',
                meta: { title: '企业制修订详情', icon: 'dashboard', affix: false, noCache: true }
            },

        ]
    },
    // 特殊立项审核
    {
        path: '/work',
        component: Layout,
        hidden: true,
        children: [{
                path: 'enterpriseStdRevise/viewProject/:id/:projectPhase/:hook',
                component: (resolve) => require(['@/views/work/enterpriseStdRevise/components/projectDetail'], resolve),
                name: 'specialProjectAudit',
                meta: { title: '特殊立项详情', icon: 'dashboard', affix: false, noCache: true }
            },

        ]
    },
    // 企业标准立项/制修订列表
    {
        path: '/work/enterpriseStdRevise/:projectPhase/:projectState',
        component: Layout,
        hidden: true,
        children: [{
                path: '',
                component: (resolve) => require(['@/views/work/enterpriseStdRevise/index'], resolve),
                name: 'enterpriseStdRevise',
                meta: { title: '企业制修订', icon: 'dashboard', affix: false }
            },

        ]
    },
    // 外部标准立项/制修订查看
    {
        path: '/work/externalStdRevise/viewProject/:id/:projectPhase',
        component: Layout,
        hidden: true,
        noCache: true,
        children: [{
                path: '',
                component: (resolve) => require(['@/views/work/externalStdRevise/components/projectDetail'], resolve),
                name: 'externalStdReviseViewProject',
                meta: { title: '外部制修订详情', icon: 'dashboard', affix: false, noCache: true },
                noCache: true
            },

        ]
    },
    // 外部标准立项/制修订列表
    {
        path: '/work/externalStdRevise/:projectPhase/:projectState',
        component: Layout,
        hidden: true,
        noCache: true,
        children: [{
                path: '',
                component: (resolve) => require(['@/views/work/externalStdRevise/index'], resolve),
                name: 'externalStdRevise',
                meta: { title: '外部制修订', icon: 'dashboard', affix: false }
            },

        ]
    },
    //  外部征求意见任务查看详情
    {
        path: '/work/externalConsultation/standard/:dispatchUser/:adviceTaskId',
        component: Layout,
        hidden: true,
        noCache: true,
        children: [{
                path: '',
                component: (resolve) => require(['@/views/work/externalConsultation/standard'], resolve),
                name: 'standardlist',
                meta: { title: '外部征求意见流程', icon: 'dashboard', affix: false },
                noCache: true
            },

        ]
    },
    //  申请标准购置
    {
        path: '/work/stdPurchaseUpdate',
        component: Layout,
        hidden: true,
        noCache: true,
        children: [{
                path: '',
                component: (resolve) => require(['@/views/work/stdPurchase/stdPurchaseUpdate'], resolve),
                name: 'stdPurchaseUpdate',
                meta: { title: '标准购置申请', icon: 'dashboard', affix: false },
                noCache: true
            },

        ]
    },
    // //  申请标准购置
    // {
    //     path: '/work/stdPurchaseUpdates',
    //     component: Layout,
    //     hidden: true,
    //     noCache: true,
    //     children: [{
    //             path: '',
    //             component: (resolve) => require(['@/views/work/stdPurchases/stdPurchaseUpdate'], resolve),
    //             name: 'stdPurchaseUpdates',
    //             meta: { title: '标准购置申请', icon: 'dashboard', affix: false },
    //             noCache: true
    //         },

    //     ]
    // },
    //  标准采购记录
    {
        path: '/work/stdPurchaseList/:isApply',
        component: Layout,
        hidden: true,
        noCache: true,
        children: [{
                path: '',
                component: (resolve) => require(['@/views/personal/profile/stdPurchase'], resolve),
                name: 'stdPurchaseList',
                meta: { title: '标准采购记录', icon: 'dashboard', affix: false },
                noCache: true
            },

        ]
    },
    // 标准购置详情(编辑，完成，审核)
    {
        path: '/work/stdPurchaseDetail/:id',
        component: Layout,
        hidden: true,
        noCache: true,
        children: [{
                path: '',
                component: (resolve) => require(['@/views/work/stdPurchase/stdPurchaseDetail'], resolve),
                name: 'stdPurchaseDetail',
                meta: { title: '标准文件购置申请单', icon: 'dashboard', affix: false },
                noCache: true
            },

        ]
    },
    
    // 企业复审任务项目列表
    {
        path: '/work/enterReviewDetail/:rwTaskId',
        component: Layout,
        hidden: true,
        noCache: true,
        children: [{
            path: '',
            component: (resolve) => require(['@/views/work/enterReview/projectList'], resolve),
            name: 'enterReviewDetail',
            meta: { title: '企业复审任务项目详情', icon: 'dashboard', affix: false },
            noCache: true
        }]
    },
    // 外部复审任务项目列表
    {
        path: '/work/externalReviewDetail/:rwTaskId',
        component: Layout,
        hidden: true,
        noCache: true,
        children: [{
            path: '',
            component: (resolve) => require(['@/views/work/externalReview/projectList'], resolve),
            name: 'externalReviewDetail',
            meta: { title: '外部复审任务项目详情', icon: 'dashboard', affix: false },
            noCache: true
        }]
    },
    // 动态流程
    {
        path: '/workflow',
        component: Layout,
        hidden: true,
        children: [{
            path: 'editor/:id',
            component: (resolve) => require(['@/views/set-process/workflowEditor/index'], resolve),
            name: 'workflow-editor',
            meta: { title: '流程编辑', activeMenu: '/workflow' }
        }]
    },
    // 内容发布详情
    {
        path: '/maintenance/contentPublish/detail/:id',
        component: Layout,
        hidden: true,
        noCache: true,
        children: [{
                path: '',
                component: (resolve) => require(['@/views/infoModule/contentDetail'], resolve),
                name: 'contentDetail',
                meta: { title: '内容发布详情', icon: 'dashboard', affix: false },
                noCache: true
            },

        ]
    },
    // {
    //     path: '/user',
    //     component: Layout,
    //     hidden: true,
    //     redirect: 'noredirect',
    //     children: [{
    //         path: 'profile',
    //         component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
    //         name: 'Profile',
    //         meta: { title: '编辑信息', icon: 'user' },
    //         noCache: true
    //     }]
    // },
    {
        path: '/system/user-auth',
        component: Layout,
        hidden: true,
        children: [{
            path: 'role/:userId(\\d+)',
            component: (resolve) => require(['@/views/system/user/authRole'], resolve),
            name: 'AuthRole',
            meta: { title: '分配角色', activeMenu: '/system/user' }
        }]
    },
    {
        path: '/system/role-auth',
        component: Layout,
        hidden: true,
        children: [{
            path: 'user/:roleId(\\d+)',
            component: (resolve) => require(['@/views/system/role/authUser'], resolve),
            name: 'AuthUser',
            meta: { title: '分配用户', activeMenu: '/system/role' }
        }]
    },
    {
        path: '/system/dict-data',
        component: Layout,
        hidden: true,
        children: [{
            path: 'index/:dictId(\\d+)',
            component: (resolve) => require(['@/views/system/dict/data'], resolve),
            name: 'Data',
            meta: { title: '字典数据', activeMenu: '/system/dict' }
        },{
            path: 'technical',
            component: (resolve) => require(['@/views/system/dict/technical'], resolve),
            name: 'Technical',
            meta: { title: '归口单位', activeMenu: '/system/dict' }  
        },{
            path: 'standard',
            component: (resolve) => require(['@/views/system/dict/standard'], resolve),
            name: 'Standard',
            meta: { title: '标准代号', activeMenu: '/system/dict' }  
        }
        ]
    },
    {
        path: '/monitor/job-log',
        component: Layout,
        hidden: true,
        children: [{
            path: 'index',
            component: (resolve) => require(['@/views/monitor/job/log'], resolve),
            name: 'JobLog',
            meta: { title: '调度日志', activeMenu: '/monitor/job' }
        }]
    },
    {
        path: '/tool/gen-edit',
        component: Layout,
        hidden: true,
        children: [{
            path: 'index',
            component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
            name: 'GenEdit',
            meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
        }]
    },
    {
        path: '/stdSystem/detail',
        component: Layout,
        hidden: true,
        children: [{
            path: 'index/:systemId(\\d+)',
            component: (resolve) => require(['@/views/stdSystem/detail'], resolve),
            name: 'SystemDetail',
            meta: { title: '体系详情', activeMenu: '/stdSystem' }
        }]
    }
]