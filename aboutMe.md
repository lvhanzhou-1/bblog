# 博客技术

① 用户端主要基于Vue.js、Vuex，Vue-router，管理端主要基于ElementUI、Vue.js

② 服务端语言使用node.js、框架使用Egg.js，博客部署在阿里云linux服务器

③ 数据据库使用MySQL，可视化工具用的SQLyog

---

# 博客特色

1 本博客使用gitee第三方进行登录，留言评论功能需要登录后使用

2 支持最高5级评论结构，评论关系一目了然，支持emoji回复、留言举报、留言删除，并使用mixin对公共模块进行抽离

3 使用keep-alive进行路由缓存，使用路由守卫拦截错误地址，使用vuex对全局状态进行管理，使用axios封装api

4 合理使用cookie，localStorage吗，indexDb进行本地缓存

5 使用egg.js搭建后端接口，支持统一响应格式，跨域设置，文件上传，请求参数校验等功能

6 支持MarkDown编辑，导入和导出，保存草稿到indexDb


