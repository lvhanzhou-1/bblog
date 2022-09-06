'use strict';

const Controller = require('egg').Controller;


class TimeLineController extends Controller {
    async queryTimeLineAll() {
        let result = await  this.ctx.service.timeLine.queryTimeLineAll()
        this.ctx.success(result)
    }
}

module.exports = TimeLineController;
