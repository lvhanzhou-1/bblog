// middleware/jwt.js


module.exports = (options) => {
    return async function (ctx, next) {

        // 拿到前端传过来的 token
        const token = ctx.request.header.authorization
        if (token) {
            //解密token
            let curToken = token.replace('Bearer ', '')


            const secret = ctx.app.config.jwt.secret
            const decoded = ctx.app.jwt.verify(curToken, secret) || 'false'


            console.log("token_payload", decoded);
            ctx.state.user = decoded

            if (decoded !== 'false') {
                await next()
            } else {
                ctx.throw(403, '无效Token')
            }
        } else {
            ctx.throw(403, '无Token')
        }
    }
}
