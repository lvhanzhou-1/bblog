'use strict';

const Controller = require('egg').Controller;


const resCode = require('../constant/resCode')
const {APP} = require('../constant/resCodeVariable')


class OauthController extends Controller {

    // gitee授权参考地址：https://www.eoway.cn/article/1603360705.html
    /**
     * 1、后端获取 code
     * 2、使用 code 获取 access_token
     * 3、使用 access_token 获取用户信息
     */
    async oauthGitee() {
        const {ctx} = this
        // gitee获取到临时code会重订向到这个接口上，
        // 拿到code后继续请求gitee的接口拿到access_token，然后使用access_token得到用户gitee上的信息
        console.log('code', ctx.request.query);

        let code = ctx.request.query.code || null

        if (code) {
            try {
                console.log(code, 'oauthGitee')
                let res = await ctx.service.oauth.oauthGitee(code)

                await ctx.render('oauthSuccess', {token: res.token})

                // ctx.success()
            } catch (err) {
                ctx.fail(resCode.get(APP.GITEE_OAUTH_FAIL), err.errMsg)
            }

            // await ctx.service.oauth.oauthGitee(code).then(async res => {
            //     // 登录成功
            //     await ctx.render('oauthSuccess', {token: res.token})
            // }).catch(err => {
            //     // 登录失败
            //     ctx.fail(resCode.get(APP.GITEE_OAUTH_FAIL), err.errMsg)
            // })


        }
    }
}

module.exports = OauthController;
