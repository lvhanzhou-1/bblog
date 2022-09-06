import axios from '../lib/request'


export const blogTagApi = {
    saveBlogTag: (data) => {
        return axios.post(`/articleTag/saveArticleTag`, data)
    },
    deleteBlogTagByUid: (data) => {
        return axios.post(`/articleTag/deleteArticleTagByUid`, data)
    },
    queryBlogTagPage: (data) => {
        return axios.post(`/articleTag/queryArticleTagPage`, data)
    },/*获取标签列表，带文章总数*/
    queryBlogTagAllwithBlogNum: (data) => {
        return axios.post(`/articleTag/queryArticleTagAll2`, data)
    },
    queryBlogTagAll: (data) => {
        return axios.post(`/articleTag/queryArticleTagAll`, data)
    },
    updateBlogTagByUid: (data) => {
        return axios.post(`/articleTag/updateArticleTagByUid`, data)
    },
}
