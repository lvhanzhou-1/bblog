// const queryUserByUidSql = `
//     select * from t_user
//     where uid = ?
// `
// const queryUserByUsernameSql = `
//     select * from t_user
//     where user_name = ?
// `
const saveTimeLineSql = `
    insert into t_time_line (uid,user_name,user_id,method,database_name,item_name,create_time,update_time)
    values (?,?,?,?,?,?,?,?)
`

const queryTimeLineAllSql = `
    select * from t_time_line
`

// const updateUserByUsernameSql = `
//     update t_user set password = ?
//     where user_name = ?
// `

module.exports = {
    // queryUserByUidSql,
    // queryUserByUsernameSql,
    // saveUserSql,
    // updateUserByUsernameSql,
    saveTimeLineSql,
    queryTimeLineAllSql,
}
