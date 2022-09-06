import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/**
 * 1、isNavigationBar：true；表示是导航栏，会在顶部显示
 * 2、name：该属性不能重复，表示某个路由的名字，如果使用keep-alive时，会使用这个名字作为标识，所以不建议重复
 * 3、第一个对象放根路由，所有的导航路由放在根路由的children里，因为我解析导航栏的时候是这么解析的，
 *      routes[0].children.map() 找到 isNavigationBar==true 的路由，所以都放这里面
 */


import Layout from "@/views/layout/Layout";
import UserLayout from "@/views/user/userLayout/UserLayout";

export const constantRouterMap = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        name: 'Layout',
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {title: '首页'},
                isNavigationBar: true,
                component: () => import('@/views/home/Home')

            },

            {
                path: '/archive',
                name: 'Archive',
                meta: {title: '文章'},
                isNavigationBar: true,
                component: () => import('@/views/archive/Archive')

            },
            {
                path: '/subject',
                name: 'Subject',
                meta: {title: '专题'},
                isNavigationBar: true,
                component: () => import('@/views/subject/Subject')
            },
            {
                path: '/messageBoard',
                name: 'MessageBoard',
                meta: {title: '留言板'},
                isNavigationBar: true,
                component: () => import('@/views/messageBoard/MessageBoard')
            },
            // {
            //     path: '/aboutMe',
            //     name: 'AboutMe',
            //     meta: {title: '关于我'},
            //     isNavigationBar: true,
            //     component: () => import('@/views/aboutMe/AboutMe')
            //
            // },



            {
                path: '/subjectInfo/:id',
                name: 'SubjectInfo',
                meta: {title: '专题详情'},
                component: () => import('@/views/subjectInfo/SubjectInfo')
            },

            {
                path: '/user',
                name: 'User',
                meta: {title: '个人主页'},
                component: () => import('@/views/user/User')
            },
            {
                path: '/articleList',
                name: 'ArticleList',
                meta: {title: '文章列表'},
                component: () => import('@/views/articleList/ArticleList')
            },
            {
                path: '/articleDetail/:id',
                name: 'ArticleDetail',
                meta: {title: '文章详情'},
                component: () => import('@/views/articleDetail/ArticleDetail')
            },

            {
                path: '/user/settings',
                name: 'UserLayout',
                component: UserLayout,
                redirect: '/user/settings/profile',
                children: [
                    {
                        path: '/user/settings/profile',
                        name: 'Profile',
                        meta: {title: '个人资料', icon: 'el-icon-user'},
                        component: () => import('@/views/user/settings/profile/Profile')
                    },
                    // {
                    //     path: '/user/settings/account',
                    //     name: 'Account',
                    //     meta: {title: '账号设置', icon: 'el-icon-setting'},
                    //     component: () => import('@/views/user/settings/account/Account')
                    // },
                ],
            },

            {
                path: '/404',
                component: () => import('../views/404/404')
            },
        ]
    }
]

const router = new Router({
    routes: constantRouterMap,
    // 刷新页面后，滚到顶部
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router
