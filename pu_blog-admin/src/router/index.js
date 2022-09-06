// 该文件专门用于创建整个应用的路由器
import Vue from 'vue'
import VueRouter from "vue-router";
//
// import About from "../components/About";
// import Home from "../components/Home";


// import Login from "@/views/login/Login";
Vue.use(VueRouter)
import Layout from "@/views/Layout/Layout";

const constantRouterMap = [

    // 404
    {
        path: '/404',
        component: () => import('@/views/404/404')
    },
    // 登录
    {
        path: '/login',
        component: () => import('@/views/login/Login')
    },

    // 首页
    {
        path: '/',
        component: Layout,
        name: '_home',
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                meta: {title: '首页', icon: 'dashboard'},
                component: () => import('@/views/dashboard/Dashboard')
            }
        ]

    },

    // 博客管理
    {
        path: '/blog',
        component: Layout,
        redirect: '/blog/blog',
        name: '_blog',
        meta: {title: '博客管理', icon: 'el-icon-setting'},
        isSidebar: true,
        children: [
            {
                path: '/blog/blog',
                name: 'Blog',
                component: () => import('@/views/blog/blog/Blog'),
                meta: {title: '博客管理', icon: 'el-icon-office-building'}
            },
            {
                path: '/blog/blogSort',
                name: 'BlogSort',
                component: () => import('@/views/blog/blogSort/BlogSort'),
                meta: {title: '分类管理', icon: 'el-icon-school'}
            },
            {
                path: '/blog/blogTag',
                name: 'BlogTag',
                component: () => import('@/views/blog/blogTag/BlogTag'),
                meta: {title: '标签管理', icon: 'el-icon-table-lamp'}
            },
            {
                path: '/blog/blogRecommend',
                name: 'BlogRecommend',
                component: () => import('../views/blog/blogRecommend/BlogRecommend'),
                meta: {title: '推荐管理', icon: 'el-icon-house'}
            },
            {
                path: '/blog/blogLike',
                name: 'BlogLike',
                component: () => import('@/views/blog/blogLike/BlogLike'),
                meta: {title: '博客点赞管理', icon: 'el-icon-goblet'}
            },

        ],
    },
    // 专题管理
    {
        path: '/special',
        component: Layout,
        redirect: '/special/specialSort',
        name: '_special',
        meta: {title: '专题管理', icon: 'el-icon-setting'},
        isSidebar: true,
        children: [
            {
                path: '/special/specialSort',
                name: 'SpecialSort',
                component: () => import('@/views/special/specialSort/SpecialSort'),
                meta: {title: '专题分类管理', icon: 'el-icon-smoking'}
            },
            {
                path: '/special/special',
                name: 'Special',
                component: () => import('@/views/special/special/Special'),
                meta: {title: '专题管理', icon: 'el-icon-shopping-cart-full'}
            },
            {
                path: '/specialPart/specialPart',
                name: 'SpecialPart',
                component: () => import('@/views/special/specialPart/SpecialPart'),
                meta: {title: '专题部分管理', icon: 'el-icon-shopping-bag-1'}
            },
            {
                path: '/specialPartSection/specialPartSection',
                name: 'SpecialPartSection',
                component: () => import('@/views/special/specialPartSection/SpecialPartSection'),
                meta: {title: '章节管理', icon: 'el-icon-present'}
            },
            {
                path: '/specialPartSectionBlog/specialPartSectionBlog',
                name: 'SpecialPartSectionBlog',
                component: () => import('@/views/special/specialPartSectionBlog/SpecialPartSectionBlog'),
                meta: {title: '章节博客管理', icon: 'el-icon-bank-card'}
            },
        ],
    },
    // 图片管理
    {
        path: '/picture',
        component: Layout,
        redirect: '/picture/pictureSort',
        name: '_picture',
        meta: {title: '图片管理', icon: 'el-icon-setting'},
        isSidebar: true,
        children: [
            {
                path: '/picture/pictureSort',
                name: 'PictureSort',
                component: () => import('@/views/picture/pictureSort/PictureSort'),
                meta: {title: '图片类别管理', icon: 'el-icon-video-camera'}
            },
            {
                path: '/picture/picture',
                name: 'Picture',
                component: () => import('@/views/picture/picture/Picture'),
                meta: {title: '图片管理', icon: 'el-icon-camera'}
            }
        ]
    },
    // 评论管理
    {
        path: '/comment',
        component: Layout,
        redirect: '/comment/comment',
        name: '_comment',
        meta: {title: '评论管理', icon: 'el-icon-setting'},
        isSidebar: true,
        children: [
            {
                path: '/comment/comment',
                name: 'Comment',
                component: () => import('@/views/comment/comment/Comment'),
                meta: {title: '评论管理', icon: 'el-icon-video-camera'}
            },

            {
                path: '/comment/commentReaction',
                name: 'CommentReaction',
                component: () => import('@/views/comment/commentReaction/CommentReaction'),
                meta: {title: '评论点赞管理', icon: 'el-icon-video-camera'}
            },

            {
                path: '/comment/commentInform',
                name: 'CommentInform',
                component: () => import('@/views/comment/commentInform/CommentInform'),
                meta: {title: '评论举报管理', icon: 'el-icon-video-camera'}
            },

        ]
    },

    // 普通用户管理
    {
        path: '/webUser',
        component: Layout,
        redirect: '/webUser/webUser',
        name: '_webUser',
        meta: {title: '用户管理', icon: 'el-icon-setting'},
        isSidebar: true,
        children: [
            {
                path: '/webUser/webUser',
                name: 'WebUser',
                component: () => import('@/views/webUser/webUser/WebUser'),
                meta: {title: '用户管理', icon: 'el-icon-video-camera'}
            },
        ]
    },
    // 系统管理
    {
        path: '/system',
        component: Layout,
        redirect: '/system/systemConfig',
        name: '_system',
        meta: {title: '系统管理', icon: 'el-icon-setting'},
        isSidebar: true,
        children: [
            {
                path: '/system/aboutMe',
                name: 'AboutMe',
                component: () => import('@/views/system/aboutMe/AboutMe'),
                meta: {title: '关于我', icon: 'el-icon-trophy'}
            },
            {
                path: '/system/contactWay',
                name: 'ContactWay',
                component: () => import('@/views/system/contactWay/ContactWay'),
                meta: {title: '联系方式', icon: 'el-icon-thumb'}
            },
            {
                path: '/system/friendLink',
                name: 'FriendLink',
                component: () => import('@/views/system/friendLink/FriendLink'),
                meta: {title: '友情链接', icon: 'el-icon-link'}
            },
            /*{
                path: '/system/systemConfig',
                name: 'SystemConfig',
                component: () => import('/src/views/system/systemConfig/SystemConfig'),
                meta: {title: '系统配置', icon: 'el-icon-bangzhu'}
            },*/
            /*{
                path: '/system/webConfig',
                name: 'WebConfig',
                component: () => import('/src/views/system/webConfig/WebConfig'),
                meta: {title: '网站配置', icon: 'el-icon-crop'}
            },*/

        ]

    },

    // 管理员管理
    {
        path: '/admin',
        component: Layout,
        redirect: '/admin/adminUser',
        name: '_admin',
        meta: {title: '管理员管理', icon: 'el-icon-setting'},
        isSidebar: true,
        children: [
            {
                path: '/admin/adminUser',
                name: 'AdminUser',
                component: () => import('@/views/admin/adminUser/AdminUser'),
                meta: {title: '管理员管理', icon: 'el-icon-video-camera'}
            },
            {
                path: '/admin/adminRole',
                name: 'AdminRole',
                component: () => import('@/views/admin/adminRole/AdminRole'),
                meta: {title: '角色管理', icon: 'el-icon-camera'}
            }
        ]
    },


]
//创建并暴露一个路由器
const router = new VueRouter({
    routes: constantRouterMap,
})

export default router
