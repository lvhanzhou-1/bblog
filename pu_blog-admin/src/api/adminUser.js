import axios from '@/lib/request'


export const adminUserApi = {
    /*保存管理员信息*/
    saveAdminUser: (data) => {
        return axios.post(`/adminUser/saveAdminUser`, data)
    },
    /*根据uid删除*/
    deleteAdminUserByUid: (data) => {
        return axios.post(`/adminUser/deleteAdminUserByUid`, data)
    },
    /*查询页数*/
    queryAdminUserPage: (data) => {
        return axios.post(`/adminUser/queryAdminUserPage`, data)
    },
    /*查询所有*/
    queryAdminUserAll: () => {
        return axios.post(`/adminUser/queryAdminUserAll`)
    },
    /*根据uid更新*/
    updateAdminUserByUid: (data) => {
        return axios.post(`/adminUser/updateAdminUserByUid`, data)
    },
    /*根据uid更新密码*/
    adminResetPasswordByUid: (data) => {
        return axios.post(`/adminUser/adminResetPasswordByUid`, data)
    },
    /*登录*/
    /*会返回token*/
    adminLogin: (data) => {

        return axios.post(`/adminUser/adminLogin`, data)
    },
    /*获取已登录信息*/
    getLoginAdminInfo: () => {
        return axios.post(`/adminUser/adminInfo`)
    },
};
