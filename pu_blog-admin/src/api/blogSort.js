import axios from '../lib/request'


export const blogSortApi = {
  saveBlogSort: (data) => {
    return axios.post(`/articleSort/saveArticleSort`, data)
  },
  deleteBlogSortByUid: (data) => {
    return axios.post(`/articleSort/deleteArticleSortByUid`, data)
  },
  queryBlogSortPage: (data) => {
    return axios.post(`/articleSort/queryArticleSortPage`, data)
  },
  queryArticleSortAll: (data) => {
    return axios.post(`/articleSort/queryArticleSortAll`, data)
  },
  /*获取分类列表，带文章总数*/
  queryArticleSortAllwithBlogNum: (data) => {
    return axios.post(`/articleSort/queryArticleSortAll2`, data)
  },
  updateBlogSortByUid: (data) => {
    return axios.post(`/articleSort/updateArticleSortByUid`, data)
  },
}
