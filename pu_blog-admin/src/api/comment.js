import axios from '../lib/request'
/*
	模式 $API文件占位符替换$
	替换方式：模块名大小驼峰替换
*/
export const commentApi = {
    saveComment: (data) => {
        return axios.post(`/comment/saveComment`, data)
    },
    deleteCommentByUid: (data) => {
        return axios.post(`/comment/deleteCommentByUid`, data)
    },
    passOrRejectCommentByUid: (commentStatus,data) => {
        return axios.post(`/comment/passOrRejectCommentByUid/${commentStatus}`, data)
    },

    queryCommentPage: (data) => {
        return axios.post(`/comment/queryCommentPage`, data)
    },
    queryCommentAll: () => {
        return axios.post(`/comment/queryCommentAll`)
    },
    updateCommentByUid: (data) => {
        return axios.post(`/comment/updateCommentByUid`, data)
    },
    /*补充，获取所有评论数*/
    queryCommentCount: () => {
        return axios.post(`/comment/queryCommentCount`)
    },


}
