const database = {
    'aboutMe': ['关于我', ''],
    // 'adminRole':'',
    'adminUser': ['管理员', 'user_name'],

    'article': ['文章', 'blog_title'],
    'articleSort': ['文章分类', 'sort_name'],
    'articleTag': ['文章标签', 'tag_name'],

    // 'blogLike':'文章点赞',
    // 'comment': '评论',
    // 'commentReaction':'',
    'contactWay': ['联系方式', 'contact_way'],

    'file': ['图片', 'file_original_name'],
    'fileSort': ['图片分类', 'sort_name'],

    'friendLink': ['友链', 'link_name'],
    'specialSort': '专题分类',
    'special': ['专题', 'special_name'],
    'specialPart': ['专题部分', 'part_name'],
    'specialPartSection': ['专题部分章节', 'section_title'],
    // 'specialPartSectionBlog': ['专题部分章节文章',],

    'webUser': ['用户', 'nick_name'],
}


const getDatabaseNameAndItemName = (url) => {

    let arr = url.split('/')
    let database_name = arr[1]
    if (database[database_name]) {
        return database[database_name]
    } else {
        return []
    }
}


const getMethod = (url) => {
    let arr = url.split('/')
    let method = arr[2]
    if (method.startsWith('update')) {
        return '更新'
    } else if (method.startsWith('delete')) {
        return '删除'
    } else if (method.startsWith('save')) {
        return '新增'
    } else {
        return ''
    }
}
getMethod('/adminUser/queryAdminUserByUid/-1')

const getItemName = (name) => {
    return name

}
module.exports = {
    getMethod,
    getItemName,
    getDatabaseNameAndItemName
}
