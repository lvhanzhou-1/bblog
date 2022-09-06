const Service = require('egg').Service;


// const {keys} = require('../constant/config')
const {
    queryUserByUidSql,
    queryUserByUsernameSql,
    saveUserSql,
    updateUserByUsernameSql,
} = require('../sql/user')


class User extends Service {

     queryUserByUid = async (uid) => {
         let resultArr = await this.app.mysql.query(queryUserByUidSql, [uid])
         return resultArr[0]
    }

     generateToken = async (data,expires) => {
        let payload = {uid: data.uid}

        // expiresIn 单位是 秒 3600s 就是1小时
        // let token = jwt.sign(payload, keys, {expiresIn: expires})
         let token = this.app.jwt.sign(
             payload,
             this.app.config.jwt.secret,
             {expiresIn:expires}
         )
        return `Bearer ${token}`
    }

     queryUserByUsername = async (username) => {
         let resultArr = await this.app.mysql.query(queryUserByUsernameSql, [username])
         return resultArr[0]
    }

     saveUser = async (uuid,username, password) => {
         await this.app.mysql.query(saveUserSql, [uuid, username, password])
    }

     updateUserByUsername = async (password,username) => {
         await this.app.mysql.query(updateUserByUsernameSql, [password, username])
    }

}

module.exports = User;
