const saveAdminUserValidator = require('./saveAdminUser')
const deleteAdminUserByUidValidator = require('./deleteAdminUserByUid')
const updateAdminUserByUidValidator = require('./updateAdminUserByUid')
const queryAdminUserPageValidator = require('./queryAdminUserPage')
const adminLoginValidator = require('./adminLogin')
const adminResetPasswordByUidValidator = require('./adminResetPasswordByUid')

const updateAminUserPassWordValidator = require('./updateAminUserPassWord')

module.exports = {
    saveAdminUserValidator,
    deleteAdminUserByUidValidator,
    updateAdminUserByUidValidator,
    queryAdminUserPageValidator,
    adminLoginValidator,
    adminResetPasswordByUidValidator,
    updateAminUserPassWordValidator
}
