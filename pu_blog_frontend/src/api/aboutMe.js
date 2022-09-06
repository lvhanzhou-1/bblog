import axios from '../lib/request'
/*
	模式 $API文件占位符替换$
	替换方式：模块名大小驼峰替换
*/
export const aboutMeApi = {
    queryAboutMePage:()=>{
        return axios.post(`/aboutMe/queryAboutMePage`)
    },
    queryAboutMeAll: () => {
        return axios.post(`/aboutMe/queryAboutMeAll`)
    },
}
