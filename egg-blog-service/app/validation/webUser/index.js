const saveWebUserValidator = require('./saveWebUser')
const deleteWebUserByUidValidator = require('./deleteWebUserByUid')
const updateWebUserByUidValidator = require('./updateWebUserByUid')
const queryWebUserPageValidator = require('./queryWebUserPage')
const webUserRegisterValidator = require('./webUserRegister')
const webUserLoginValidator = require('./webUserLogin')
module.exports = {
    saveWebUserValidator,
    deleteWebUserByUidValidator,
    updateWebUserByUidValidator,
    queryWebUserPageValidator,
    webUserRegisterValidator,
    webUserLoginValidator
}
