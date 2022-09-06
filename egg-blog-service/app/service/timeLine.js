const Service = require('egg').Service;

const {
    queryTimeLineAllSql,
    saveTimeLineSql
} = require('../sql/timeLine/timeLine')


class TimeLine extends Service {


    async queryTimeLineAll() {
        return await this.app.mysql.query(queryTimeLineAllSql, [])
    }

    async saveTimeLine(params) {
        let {uuid, user_name, user_id, method, database_name, item_name, create_time, update_time} = params
        await this.app.mysql.query(saveTimeLineSql, [uuid, user_name, user_id, method, database_name, item_name, create_time, update_time])
        return true
    }

}

module.exports = TimeLine;
