const resCode = require('../constant/resCode')
const {APP} = require('../constant/resCodeVariable')

module.exports = {
    success(data = {}, successMsg, code, type = 'json') {
        this.body = {
            code: code || resCode.get(APP.SUCCESS).code,
            msg: successMsg || resCode.get(APP.SUCCESS).msg,
            data
        }
    },


    fail({msg, code} = {}, extendInfo) {
        this.body = {
            code: code || resCode.get(APP.FAIL).code,
            msg: msg || resCode.get(APP.FAIL).msg,
            extendInfo
        }
    },
}

