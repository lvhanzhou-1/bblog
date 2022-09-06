'use strict';

const Controller = require('egg').Controller;

const {
  uploadFileValidator,
  deleteFileByUidValidator,
  updateFileSortByUidValidator,
} = require('../validation/file');
const resCode = require('../constant/resCode');
const { FILE, APP } = require('../constant/resCodeVariable');
// const generateUuid = require('../utils/generateUuid');

class FileController extends Controller {

  async uploadFile() {
    const { ctx } = this;
    /**
         * 1、参数校验
         *  上传的文件不能为空
         */

    const fileExtraData = ctx.request.body;

    console.log(ctx.request);

    const files = ctx.request.files;


    const { errorMsg, isValid } = uploadFileValidator(files);

    if (!isValid) {
      ctx.fail(resCode.get(FILE.FILE_UPLOAD_ERROR), errorMsg);
    } else {
      const result = await ctx.service.file.uploadFile(files, fileExtraData);
      ctx.success(result);
    }


  }

  async queryAllFileSort() {
    const { ctx } = this;

    const result = await ctx.service.file.queryAllFileSort();
    ctx.success(result);
  }

  async queryAllFilePage() {
    const { ctx } = this;

    let { currentPage, pageSize, fileSortId, createTime } = ctx.request.body;
    if (!createTime) { // 模糊查询，如果没有，就传个空字符串
      createTime = '';
    }
    console.log(ctx.request.body, 'ctx.request.body');
    const result = await ctx.service.file.queryAllFilePage(+currentPage, +pageSize, fileSortId, createTime);
    const { total } = await ctx.service.file.queryAllFileCount(fileSortId, createTime);
    const newResult = {
      result,
      total,
      currentPage,
      pageSize,
    };
    ctx.success(newResult);
  }

  async queryAllFile() {
    const { ctx } = this;

    let { fileSortId, createTime } = ctx.request.body;

    fileSortId = fileSortId ? fileSortId : '';
    createTime = createTime ? createTime : '';


    console.log(ctx.request.body, 'ctx.request.body');

    const result = await ctx.service.file.queryAllFile(fileSortId, createTime);

    ctx.success(result);
  }


  async deleteFileByUid() {
    const { ctx } = this;

    /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */
    const uids = ctx.request.body;
    console.log(uids, 'uids');
    const { errorMsg, isValid } = deleteFileByUidValidator(uids);
    if (!isValid) { // 校验不通过
      ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg);
    } else {
      const result = await ctx.service.file.deleteFileByUid(uids);
      if (result) {
        ctx.success();
      }
    }
  }

  async updateFileSortByUid() {
    const { ctx } = this;

    /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */
    const { fileIds, sortId } = ctx.request.body;
    console.log(ctx.request.body, 'ctx.request.body');
    const { errorMsg, isValid } = updateFileSortByUidValidator(fileIds, sortId);
    if (!isValid) { // 校验不通过
      ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg);
    } else {
      // 根据uid修改这条记录
      const result = await ctx.service.file.updateFileSortByUid(fileIds, sortId);
      if (result) {
        ctx.success();

        // /*保存 timeLine */
        // await this.ctx.service.timeLine.saveTimeLine({
        //     uuid: generateUuid(),
        //     user_name: this.ctx.request.header.username,
        //     user_id: this.ctx.request.header.userid,
        //     method: 'save',
        //     database_name: 't_file',
        //     item_name: file.name,
        //     create_time: createTime,
        //     update_time: updateTime,
        // })
      }
    }

  }


}

module.exports = FileController;
