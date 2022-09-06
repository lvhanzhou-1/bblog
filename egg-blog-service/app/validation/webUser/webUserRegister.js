const {isEmpty} = require('../../utils/toolsFunction')

/**
 * @param user_email 不能位空
 * @param userName
 * @param password 不能位空
 */
module.exports = (user_email,userName, password) => {
    let isValid = false // 默认校验不通过

    let _user_email = isEmpty(user_email)? '' : user_email
    let _userName = isEmpty(userName)? '' : userName
    let _password = isEmpty(password)? '' : password

    if (!_user_email) {
        return {
            errorMsg: '邮箱不能为空',
            isValid,
        }
    }

    if (!_userName) {
        return {
            errorMsg: '用户名不能为空',
            isValid,
        }
    }

    if (!_password) {
        return {
            errorMsg: '密码不能位空',
            isValid,
        }
    }

    isValid = true // 当所有的逻辑走完之后，校验通过

    return {
        errorMsg: '校验通过',
        isValid
    }
}
