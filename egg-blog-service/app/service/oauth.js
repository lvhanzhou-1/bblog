const Service = require('egg').Service;

const axios = require('axios');

const {giteeLogin, baseUrl} = require('../constant/config')
const generateUuid = require('../utils/generateUuid')
const dayjs = require('dayjs')

class Oauth extends Service {
    /**
     * Gitee登录
     * 1、后端获取 code
     * 2、使用 code 获取 access_token
     * 3、使用 access_token 获取用户信息
     */

    async oauthGitee(code) {
        let myToken; // 自己生成的token

        // 1、使用 code 获取 access_token
        let {access_token} = await this.getGiteeAccessToken(code)

        // 2、使用 access_token 获取用户信息
        let userInfo = await this.getGiteeUserInfoByAccessToken(access_token)

        console.log('userInfo');
        console.log(userInfo);

        // 3、判断数据库中是否已经存过当前用户的信息
        let findResult = await this.getUserInfoFromDataBase(userInfo, 'Gitee')
        console.log(findResult, 'findResult findResult findResult')

        if (!findResult) { // 如果没有存在 保存数据到数据库中
            console.log('不存在，保存数据')
            let saveResult = await this.saveInfoToDataBase(userInfo, 'Gitee')
            if (saveResult) {
                // 4、生成token返回给前台，获取用户信息
                let dataBaseUserInfo = await this.getUserInfoFromDataBase(userInfo, 'Gitee')

                console.log('dataBaseUserInfo');
                console.log(dataBaseUserInfo);
                // 生成token
                myToken = await this.ctx.service.adminUser.generateToken(dataBaseUserInfo, giteeLogin.expires, 'webUser')
            }
        } else { // 已存在不需要保存
            console.log('已存在，不需要保存')
            // 生成token
            myToken = await this.ctx.service.adminUser.generateToken(findResult, giteeLogin.expires, 'webUser')
        }

        return {
            loginSuccess: true, // 登录成功
            token: myToken
        }

    }

    /**
     * @description 判断第三方数据是否已经在数据库中保存过
     * @param {Object} userInfo 第三方获取来的用户信息
     * @param {String} accountSource 用户信息获取来源：Gitee、Github、Microblog、QQ
     * @return {Boolean} true：存在；false：不存在
     */

    async getUserInfoFromDataBase(userInfo, accountSource) {


        let params = {}

        switch (accountSource) {
            case 'Gitee':
                params.userGitee = userInfo.login
                params.userQq = ''
                break
            case 'QQ':
                params.userQq = userInfo.openid
                params.userGitee = ''
                break
        }

        console.log('开始查询');
        console.log(params);
        // let result = await this.ctx.service.webUser.queryWebUser(params)
        let result = await this.app.mysql.query(
            'select * from t_web_user where user_gitee like ? and user_qq like ? and account_source like ? order by order_num',
            [params.userGitee, params.userQq, accountSource])

        return result[0]

    }

    /**
     * @description 保存第三方信息到数据库中
     * @param {Object} userInfo 第三方获取来的用户信息
     * @param {String} accountSource 用户信息获取来源：Gitee、Github、Microblog、QQ
     */
    async saveInfoToDataBase(userInfo, accountSource) {

        //     // 内部调用，不是接口，模拟个ctx
        //     const params = {
        //
        // }

        let userTel = ''
        let userProfile = ''
        let userWechat = ''
        let userMicroblog = ''
        let userGitee = ''
        let userGithub = ''
        let userQq = ''
        let userEmail = ''
        let userPassword = ''
        let nickName = ''
        let userPosition = ''
        let userCompany = ''
        let userWebsite = ''
        let userIntro = ''
        let gender = 1
        let userIdentity = 1
        let loginIpAddress = ''
        let lastLoginTime = ''
        let accountStatus = 1
        let dataAuditStatus = 1
        // let accountSource = accountSource ? accountSource : ''
        let orderNum = 0


        // 补充参数
        const uid = generateUuid()
        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')


        const params = {
            uid, userTel, userProfile, userWechat, userMicroblog,
            userGitee, userGithub, userQq, userEmail,
            userPassword, nickName, userPosition, userCompany,
            userWebsite, userIntro, gender, userIdentity, loginIpAddress,
            lastLoginTime, accountStatus, dataAuditStatus, accountSource,
            orderNum, createTime, updateTime
        }

        switch (accountSource) {
            case 'Gitee':
                // params.request.body = {
                //     accountSource,
                //     userGitee: userInfo.login,
                //     nickName: userInfo.name,
                //     userProfile: userInfo.avatar_url,
                //     userEmail: userInfo.email,
                //     internalCalls: true, // 内部调用，不是接口，模拟个ctx
                // }

                params.userGitee = userInfo.login
                params.nickName = userInfo.name
                params.userProfile = userInfo.avatar_url
                params.userEmail = userInfo.email
                params.internalCalls = true

                break
            case 'QQ':
                params.request.body = {
                    accountSource,
                    userQq: userInfo.openid,
                    nickName: userInfo.nickname,
                    userProfile: userInfo.figureurl_qq_2,
                    gender: userInfo.gender_type,
                    internalCalls: true, // 内部调用，不是接口，模拟个ctx
                }
                break
            case 'Microblog':
                params.request.body = {
                    accountSource,
                    userMicroblog: userInfo.idstr,
                    nickName: userInfo.name,
                    userProfile: userInfo.avatar_large,
                    internalCalls: true, // 内部调用，不是接口，模拟个ctx
                }
                break
        }

        // console.log(params, 'saveInfoToDataBase')

        await this.ctx.service.webUser.saveWebUser(params)

        // await webUserController.saveWebUser(params)
        console.log('保存成功');
        return true
    }

    getGiteeAccessToken(code) {
        return new Promise((resolve, reject) => {
            let client_id = giteeLogin.client_id
            let client_secret = giteeLogin.client_secret
            let redirect_uri = `${baseUrl}/oauth/callback/gitee`

            let option = {
                method: 'post',
                url: `https://gitee.com/oauth/token`,
                data: {
                    grant_type: 'authorization_code',
                    code,
                    client_id,
                    client_secret,
                    redirect_uri
                }
            }

            axios(option).then(res => {
                if (res.status === 200) {
                    resolve(res.data)
                }
            }).catch(err => {
                console.log(err, 'getGiteeAccessToken')
                reject({
                    loginSuccess: false, // 登录失败
                    errMsg: err.response ? err.response.data.error_description : ''
                })
            })

        })

    }

    getGiteeUserInfoByAccessToken(access_token) {
        return new Promise((resolve, reject) => {
            let option = {
                method: 'get',
                url: `https://gitee.com/api/v5/user`,
                params: {
                    access_token
                }
            }
            axios(option).then(async res => {
                if (res.status === 200) {
                    resolve(res.data)
                }
            }).catch(err => {
                console.log(err, 'getGiteeUserInfoByAccessToken')
                reject(err)
            })
        })
    }


}

module.exports = Oauth;
