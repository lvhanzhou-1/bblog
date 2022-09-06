// 'use strict';
//
// const dayjs = require('dayjs');
// const fs = require('fs');
// const path = require('path');
// const generateUuid = require("../utils/generateUuid");

// const {
//     getMethod,
//     getDatabaseNameAndItemName,
// } = require('../utils/timeLineHelper')

//
// module.exports = () => {
//     return async (ctx, next) => {
//         const req = ctx.request;
//         const res = ctx.response;
//
//         await next();
//
//         console.log(req);
//         let method = getMethod(req.url)
//         const databaseNameAndItemName = getDatabaseNameAndItemName(req.url)
//         /*需要记录*/
//         if (databaseNameAndItemName.length && (method !== '')) {
//             let database_name = databaseNameAndItemName[0]
//             let item_name = databaseNameAndItemName[1]
//
//             if (method === '新增' && item_name !== '') {
//                 /*不是 aboutMe*/
//                 item_name = req.body[item_name]
//             } else {
//                 item_name = '-1'
//             }
//             const uid = generateUuid()
//             const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
//             const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
//
//
//             const user_id = req.header.userid
//             const user_name_result = await ctx.service.adminUser.queryAdminUserByUid(user_id)
//             const user_name = user_name_result['user_name']
//
//
//             console.log({
//                 uid,
//                 user_name,
//                 user_id,
//                 method,
//                 database_name,
//                 item_name,
//                 createTime,
//                 updateTime
//             });
//         }
//
//         // const result = await ctx.service.adminUser.queryAdminUserByUid(user_id)
//         // const user_name = result['user_name']
//
//
//         // const data ={
//         //     uid
//         //     user_name
//         //     user_id
//         //     method
//         //     database_name
//         //     item_name
//         //     create_time
//         //     update_time
//         // }
//
//         // let
//         //     res2 = await ctx.service.timeLine.queryTimeLineAll()
//         // console.log('res2');
//         // console.log(res2);
//
//         /**
//          * 用户名，那个数据库，什么操作，时间，哪个对象
//          * */
//
//         // const data = dayjs(sTime).format('YYYY-MM-DD HH:mm:ss') + '[test-httpLog]' + JSON.stringify(log) + '\r\n';
//
//
//         // if (ctx.app.env === 'local') {
//         //     fs.appendFileSync(path.resolve(ctx.app.baseDir, './httpLog/httpLog-local.js'), data);
//         //     // console.log(ctx.app.baseDir);
//         // } else {
//         //     fs.appendFileSync(path.resolve(ctx.app.baseDir, './httpLog/httpLog-prod.js'), data);
//         //     // console.log(ctx.app.baseDir);
//         // }
//     };
// };

let obj = {
    userName:'testAdmin', userPassword:'123456', userProfile:'testuserProfile', nickName:'testnickName', userIntro:'userIntro', userProfession:'testuserProfession',
    roleId:'1', gender:"male", loginIpAddress:'test', lastLoginTime:'test',
    orderNum:'-1', userEmail:'dawdawdawda@dawda.com'
}

console.log(JSON.stringify(obj));
