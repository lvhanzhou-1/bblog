'use strict';

const Controller = require('egg').Controller;
const {
  saveWebUserValidator,
  deleteWebUserByUidValidator,
  updateWebUserByUidValidator,
  queryWebUserPageValidator,
} = require('../validation/webUser');
const resCode = require('../constant/resCode');
const { WEB_USER, APP, ADMIN } = require('../constant/resCodeVariable');
const generateUuid = require('../utils/generateUuid');
const dayjs = require('dayjs');

const { expires } = require('../constant/config');
const { webUserLoginValidator, webUserRegisterValidator } = require('../validation/webUser');
const { compare, encryption } = require('../utils/encryption');
const nodemailer = require('nodemailer');
const path = require('path');
const { nodemailerConfig } = require('../constant/config');

// 通过代理邮箱群发 邮件
const transporter = nodemailer.createTransport({
  service: nodemailerConfig.service, // 调用qq服务器
  secureConnection: nodemailerConfig.secureConnection, // 启动SSL
  port: nodemailerConfig.port, // 端口就是465
  auth: {
    user: nodemailerConfig.user_email, // 账号
    pass: nodemailerConfig.auth_code, // 授权码,
  },
});


class WebUserController extends Controller {

  /**
     * 登录，并签发token
     * */
  async webUserLogin() {
    const { ctx } = this;

    const { username_email, password, isRememberMe } = ctx.request.body;

    console.log(username_email, password);
    const expiresIn = isRememberMe ? 3600 * 24 * 7 : expires; // token默认过期时间
    console.log('正在校验');
    // 参数校验,检查是否为空
    const { errorMsg, isValid } = webUserLoginValidator(username_email, password);

    if (!isValid) { // 校验不通过
      console.log('校验不通过');
      ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg);
    } else {
      console.log('校验通过');
      const result = await ctx.service.webUser.queryUserByEmail(username_email);
      console.log('查询结果为', result);
      if (!result) { // 用户名不存在
        ctx.fail(resCode.get(WEB_USER.WEB_USER_DOES_NOT_EXIST));
      } else {
        // 验证 密码是否正确
        const isCorrect = await compare(password, result.user_password);
        if (isCorrect) { // 密码正确
          /**
           * 签发token
           * */
          const token = await ctx.service.adminUser.generateToken(result, expiresIn, 'webUser');
          console.log(ctx.state.user);
          ctx.success(token);
        } else { // 密码错误
          ctx.fail(resCode.get(WEB_USER.WEB_USER_PASSWORD_IS_INCORRECT));
        }
      }
    }
  }

  /**
     * 发送邮件
     * @param mail
     * @param code
     * */
  async send(mail, code) {
    // 邮件信息
    await transporter.sendMail({
      from: nodemailerConfig.user_email, // sender address
      to: mail, // 接收者邮箱 可以是多个 以,号隔开
      subject: '验证码', // Subject line
      // 发送text或者html格式
      // text: `验证码：${code}.您正在使用登录功能，验证码有效时间为${nodemailerConfig.expires}min`
      html: `验证码：<h1>${code}</h1>验证码有效时间为  ${(nodemailerConfig.expires) / 60}分钟`,
      // html:`<h1>xxxx</h1>`
    });

  }

  generate_code(codeLength) {
    let res = '';
    for (let i = 0; i < codeLength; i++) {
      res += String(Math.floor(Math.random() * 10));
    }
    return res;
  }

  /**
     * 点击获取验证码，注册时使用
     * */
  async sendCodeEmail() {
    const { ctx } = this;

    const { username_email } = ctx.request.body;

    // 参数校验,检查是否为空
    const { errorMsg, isValid } = webUserLoginValidator(username_email, 'password');

    if (!isValid) { // 校验不通过
      console.log('sendCodeEmail校验不通过');
      ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg);
    } else {
      const result = await ctx.service.webUser.queryUserByEmail(username_email);
      console.log('sendCodeEmail  result');
      console.log(result);
      if (result) { // 邮箱已被注册，无法发送验证码
        ctx.fail(resCode.get(ADMIN.USER_EMAIL_ALREADY_EXISTS), '邮箱已被注册');
      } else {

        const code = this.generate_code(nodemailerConfig.codeLength);


        // 否则，发送验证码，并将此验证码返回给前台
        await this.send(username_email, code);


        ctx.success({ code, expires: nodemailerConfig.expires });
      }
    }
  }

  /**
     * 注册
     * */
  async webUserRegister() {

    const { ctx } = this;

    let { user_profile, userName, username_email, password } = ctx.request.body;

    console.log('user_profile, userName, username_email, password ');
    console.log(user_profile, userName, username_email, password);
    // let expiresIn = isRememberMe ? 3600 * 24 * 7 : expires // token默认过期时间

    // 参数校验,检查是否为空
    const { errorMsg, isValid } = webUserRegisterValidator(username_email, userName, password);

    const userTel = '';
    const userProfile = user_profile; // 拼接文件上传的目录，不包含文件名
    const userWechat = '';
    const userMicroblog = '';
    const userGitee = '';
    const userGithub = '';
    const userQq = '';

    const userPosition = '';
    const userCompany = '';
    const userWebsite = '';
    const userIntro = '';
    const gender = 1;
    const userIdentity = 1;
    const loginIpAddress = '';
    const lastLoginTime = '';
    const accountStatus = 1;
    const dataAuditStatus = 1;
    const accountSource = '';
    const orderNum = 0;
    password = await encryption(password); // 对密码进行加密
    const uid = generateUuid();
    const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const params = {
      uid, userTel, userProfile, userWechat, userMicroblog,
      userGitee, userGithub, userQq, userEmail: username_email,
      userPassword: password, nickName: userName, userPosition, userCompany,
      userWebsite, userIntro, gender, userIdentity, loginIpAddress,
      lastLoginTime, accountStatus, dataAuditStatus, accountSource,
      orderNum, createTime, updateTime,
    };

    if (!isValid) { // 校验不通过
      ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg);
    } else {
      /* 直接保存，然后返回true*/
      await ctx.service.webUser.saveWebUser(params);

      ctx.success({}, 'true');
    }
  }

  /**/


  async queryWebUserCount() {
    const { ctx } = this;
    console.log(ctx.request.body, 'ctx.request.body');
    const result = await ctx.service.webUser.queryWebUserAll();
    let res = 0;
    if (result.length) {
      res = result.length;
    } else {
      res = 0;
    }
    ctx.success(res);
  }

  async saveWebUser() {
    const { ctx } = this;
    /**
         * 这里把数据库表里的字段都声明出来
         * 除了 uid create_time update_time
         *
         * 这些都是可以从前台接收来的参数
         *
         * 模式：$保存接口，参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid,createTime,updateTime
         */
    let {
      userTel, userProfile, userWechat, userMicroblog, userGitee,
      userGithub, userQq, userEmail, userPassword,
      nickName, userPosition, userCompany, userWebsite,
      userIntro, gender, userIdentity, loginIpAddress, lastLoginTime,
      accountStatus, dataAuditStatus, accountSource, orderNum,
      // internalCalls 特殊的参数，只需要后台调用时传递，为了区别一下，仅仅保存数据，不是为了返回给前台结果
      internalCalls,
    } = ctx.request.body;

    console.log(ctx.request.body, 'ctx.request.body');
    /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$保存接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
    const { errorMsg, isValid } = saveWebUserValidator(
      accountSource
    );

    /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$新增接口，未传递参数设置默认值$
         * 模式解析方式：提取出解析过的数据表中，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
    userTel = userTel ? userTel : '';
    userProfile = userProfile ? userProfile : '';
    userWechat = userWechat ? userWechat : '';
    userMicroblog = userMicroblog ? userMicroblog : '';
    userGitee = userGitee ? userGitee : '';
    userGithub = userGithub ? userGithub : '';
    userQq = userQq ? userQq : '';
    userEmail = userEmail ? userEmail : '';
    userPassword = userPassword ? userPassword : '';
    nickName = nickName ? nickName : '';
    userPosition = userPosition ? userPosition : '';
    userCompany = userCompany ? userCompany : '';
    userWebsite = userWebsite ? userWebsite : '';
    userIntro = userIntro ? userIntro : '';
    gender = gender ? gender : 1;
    userIdentity = userIdentity ? userIdentity : 1;
    loginIpAddress = loginIpAddress ? loginIpAddress : '';
    lastLoginTime = lastLoginTime ? lastLoginTime : '';
    accountStatus = accountStatus ? accountStatus : 1;
    dataAuditStatus = dataAuditStatus ? dataAuditStatus : 1;
    accountSource = accountSource ? accountSource : '';
    orderNum = orderNum ? orderNum : 0;


    // 补充参数
    const uid = generateUuid();
    const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

    /**
         * 封装好处理过的参数
         *
         * 模式：$保存接口，封装处理过的参数$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰变量
         *
         */
    const params = {
      uid, userTel, userProfile, userWechat, userMicroblog,
      userGitee, userGithub, userQq, userEmail,
      userPassword, nickName, userPosition, userCompany,
      userWebsite, userIntro, gender, userIdentity, loginIpAddress,
      lastLoginTime, accountStatus, dataAuditStatus, accountSource,
      orderNum, createTime, updateTime,
    };
    if (internalCalls) { // 内部服务器调用，不用返回给前台数据，只是为了保存数据
      return await ctx.service.webUser.saveWebUser(params);
    } // 正常接口访问
    if (!isValid) { // 校验不通过
      ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg);
    } else {
      /**
             * 保存的时候需要校验 是否已经保存过
             * 定义默认根据数据库表中的第二个字段查询（第一个字段是Uid）
             *
             * 模式：$保存接口，根据第二个字段查询是否已经保存过$
             * 模式解析方式：提取出所有解析过的数据表字段，数组第二项的字段值，替换为为大驼峰格式字符串
             *
             */
      const result = await ctx.service.webUser.queryWebUserByUserTel(userTel);

      if (result) { // 已存在，不保存
        /**
                 * 获取错误码所属的模块
                 *
                 * 模式：$保存接口，获取已存在错误码模块$
                 * 模式解析方式：从控制台中获得---通过正则解析出原文件resCodeVariable.js中的错误码模块名
                 *  （每次创建新模块时候，如果需要，提前创建好所需的错误码），
                 *    然后运行npm run add 执行创建代码脚本时，从控制台选择所涉及到的模块错误码，
                 *  替换为常量格式字符串
                 */
        ctx.fail(resCode.get(WEB_USER.WEB_USER_TEL_ALREADY_EXISTS));

      } else {
        const flag = await ctx.service.webUser.saveWebUser(params);
        if (flag) {
          ctx.success();

          /* 保存 timeLine */
          await this.ctx.service.timeLine.saveTimeLine({
            uuid: generateUuid(),
            user_name: this.ctx.request.header.username,
            user_id: this.ctx.request.header.userid,
            method: 'save',
            database_name: 't_web_user',
            item_name: nickName,
            create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          });


        }
      }
    }


  }

  /**
     * 删除接口传入的参数是一个uid的数组
     * 数据库设计的时候，所有的主键规定都为uid，由服务端自行生成，
     * （除非中间表，不需要维护主键，选择id自增，由数据库自己维护）
     */
  async deleteWebUserByUid() {
    const { ctx } = this;
    const uids = ctx.request.body;
    console.log(uids, 'uids');
    const { errorMsg, isValid } = deleteWebUserByUidValidator(ctx.request.body);

    if (!isValid) { // 校验不通过
      ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg);
    } else {
      const result = await ctx.service.webUser.deleteWebUserByUid(uids);
      if (result) {
        ctx.success();
      }
    }
  }

  async queryWebUserPage() {
    const { ctx } = this;
    /**
         * 这里把数据库表里的字段都声明出来
         * 除了 uid create_time update_time
         *
         * 这些都是可以从前台接收来的参数
         *
         * 模式：$分页查询接口，参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
    let {
      currentPage, pageSize,
      userTel, userProfile, userWechat, userMicroblog, userGitee,
      userGithub, userQq, userEmail, userPassword,
      nickName, userPosition, userCompany, userWebsite,
      userIntro, gender, userIdentity, loginIpAddress, lastLoginTime,
      accountStatus, dataAuditStatus, accountSource, orderNum,
    } = ctx.request.body;

    console.log(ctx.request.body, 'ctx.request.body');
    /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$分页查询接口，参数校验参数接收$
         * 模式解析方式：只需校验 currentPage, pageSize
         *
         */
    const { errorMsg, isValid } = queryWebUserPageValidator(currentPage, pageSize);

    /**
         * 模糊查询，如果前台没有传入，就设置为空字符串
         *
         * 模式：$分页查询接口，未传递参数设置空字符串$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值，且默认值不为null的字段，替换为小驼峰格式字符串
         *
         */
    userTel = userTel ? userTel : '';
    userProfile = userProfile ? userProfile : '';
    userWechat = userWechat ? userWechat : '';
    userMicroblog = userMicroblog ? userMicroblog : '';
    userGitee = userGitee ? userGitee : '';
    userGithub = userGithub ? userGithub : '';
    userQq = userQq ? userQq : '';
    userEmail = userEmail ? userEmail : '';
    userPassword = userPassword ? userPassword : '';
    nickName = nickName ? nickName : '';
    userPosition = userPosition ? userPosition : '';
    userCompany = userCompany ? userCompany : '';
    userWebsite = userWebsite ? userWebsite : '';
    userIntro = userIntro ? userIntro : '';
    gender = gender ? gender : '%';
    userIdentity = userIdentity ? userIdentity : '%';
    loginIpAddress = loginIpAddress ? loginIpAddress : '';
    lastLoginTime = lastLoginTime ? lastLoginTime : '';
    accountStatus = accountStatus ? accountStatus : '%';
    dataAuditStatus = dataAuditStatus ? dataAuditStatus : '%';
    accountSource = accountSource ? accountSource : '';
    orderNum = orderNum ? orderNum : '%';


    /**
         * 封装好处理过的参数
         *
         * 模式：$分页查询接口，封装处理过的参数$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，
         *
         */
    const params = {
      currentPage: +currentPage,
      pageSize: +pageSize,
      userTel, userProfile, userWechat, userMicroblog, userGitee,
      userGithub, userQq, userEmail, userPassword,
      nickName, userPosition, userCompany, userWebsite,
      userIntro, gender, userIdentity, loginIpAddress, lastLoginTime,
      accountStatus, dataAuditStatus, accountSource, orderNum,
    };

    if (!isValid) { // 校验不通过
      ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg);
    } else {
      const result = await ctx.service.webUser.queryWebUserPage(params);
      const { total } = await ctx.service.webUser.queryAllCountWebUser(params);
      const newResult = {
        result,
        total,
        currentPage,
        pageSize,
      };
      ctx.success(newResult);
    }
  }

  async queryWebUser() {
    const { ctx } = this;
    /**
         * 这里把数据库表里的字段都声明出来
         * 除了 uid create_time update_time
         *
         * 这些都是可以从前台接收来的参数
         *
         * 模式：$分页查询接口，参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
    let {
      userTel, userProfile, userWechat, userMicroblog, userGitee,
      userGithub, userQq, userEmail, userPassword,
      nickName, userPosition, userCompany, userWebsite,
      userIntro, gender, userIdentity, loginIpAddress, lastLoginTime,
      accountStatus, dataAuditStatus, accountSource, orderNum,

      // internalCalls 特殊的参数，只需要后台调用时传递，为了区别一下，仅仅保存数据，不是为了返回给前台结果
      internalCalls,

    } = ctx.request.body;

    console.log(ctx.request.body, 'ctx.request.body');


    /**
         * 模糊查询，如果前台没有传入，就设置为空字符串
         *
         * 模式：$分页查询接口，未传递参数设置空字符串$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值，且默认值不为null的字段，替换为小驼峰格式字符串
         *
         */
    userTel = userTel ? userTel : '';
    userProfile = userProfile ? userProfile : '';
    userWechat = userWechat ? userWechat : '';
    userMicroblog = userMicroblog ? userMicroblog : '';
    userGitee = userGitee ? userGitee : '';
    userGithub = userGithub ? userGithub : '';
    userQq = userQq ? userQq : '';
    userEmail = userEmail ? userEmail : '';
    userPassword = userPassword ? userPassword : '';
    nickName = nickName ? nickName : '';
    userPosition = userPosition ? userPosition : '';
    userCompany = userCompany ? userCompany : '';
    userWebsite = userWebsite ? userWebsite : '';
    userIntro = userIntro ? userIntro : '';
    gender = gender ? gender : '%';
    userIdentity = userIdentity ? userIdentity : '%';
    loginIpAddress = loginIpAddress ? loginIpAddress : '';
    lastLoginTime = lastLoginTime ? lastLoginTime : '';
    accountStatus = accountStatus ? accountStatus : '%';
    dataAuditStatus = dataAuditStatus ? dataAuditStatus : '%';
    accountSource = accountSource ? accountSource : '';
    orderNum = orderNum ? orderNum : '%';


    /**
         * 封装好处理过的参数
         *
         * 模式：$分页查询接口，封装处理过的参数$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，
         *
         */
    const params = {
      userTel, userProfile, userWechat, userMicroblog, userGitee,
      userGithub, userQq, userEmail, userPassword,
      nickName, userPosition, userCompany, userWebsite,
      userIntro, gender, userIdentity, loginIpAddress, lastLoginTime,
      accountStatus, dataAuditStatus, accountSource, orderNum,
    };

    const result = await ctx.service.webUser.queryWebUser(params);

    if (internalCalls) { // 内部调用，返回结果
      return result;
    } // 正常接口调用
    ctx.success(result);

  }

  async updateWebUserByUid() {
    const { ctx } = this;
    /**
         * 这里把数据库表里的字段都声明出来
         * 除了 create_time update_time
         *
         * 这些都是可以从前台接收来的参数
         *
         * 模式：$更新接口，参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 createTime,updateTime
         */

    let {
      uid, userTel, userProfile, userWechat, userMicroblog,
      userGitee, userGithub, userQq, userEmail,
      userPassword, nickName, userPosition, userCompany,
      userWebsite, userIntro, gender, userIdentity, loginIpAddress,
      lastLoginTime, accountStatus, dataAuditStatus, accountSource,
      orderNum,
    } = ctx.request.body;

    console.log(ctx.request.body, 'ctx.request.body');

    /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$更新接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 createTime,updateTime
         *
         */
    const { errorMsg, isValid } = updateWebUserByUidValidator(
      uid, accountSource
    );

    /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$更新接口，未传递参数设置默认值$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
    userTel = userTel ? userTel : '';
    userProfile = userProfile ? userProfile : '';
    userWechat = userWechat ? userWechat : '';
    userMicroblog = userMicroblog ? userMicroblog : '';
    userGitee = userGitee ? userGitee : '';
    userGithub = userGithub ? userGithub : '';
    userQq = userQq ? userQq : '';
    userEmail = userEmail ? userEmail : '';
    userPassword = userPassword ? userPassword : '';
    nickName = nickName ? nickName : '';
    userPosition = userPosition ? userPosition : '';
    userCompany = userCompany ? userCompany : '';
    userWebsite = userWebsite ? userWebsite : '';
    userIntro = userIntro ? userIntro : '';
    gender = gender ? gender : 1;
    userIdentity = userIdentity ? userIdentity : 1;
    loginIpAddress = loginIpAddress ? loginIpAddress : '';
    lastLoginTime = lastLoginTime ? lastLoginTime : '';
    accountStatus = accountStatus ? accountStatus : 1;
    dataAuditStatus = dataAuditStatus ? dataAuditStatus : 1;
    accountSource = accountSource ? accountSource : '';
    orderNum = orderNum ? orderNum : 0;


    // 补充参数
    const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

    /**
         * 封装好处理过的参数
         *
         * 模式：$保存接口，封装处理过的参数$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰变量
         *
         */
    const params = {
      uid, userTel, userProfile, userWechat, userMicroblog,
      userGitee, userGithub, userQq, userEmail,
      userPassword, nickName, userPosition, userCompany,
      userWebsite, userIntro, gender, userIdentity, loginIpAddress,
      lastLoginTime, accountStatus, dataAuditStatus, accountSource,
      orderNum, updateTime,
    };

    if (!isValid) { // 校验不通过
      ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg);
    } else {

      // 补充参数
      const { create_time } = await ctx.service.webUser.queryWebUserByUid(uid);
      params.createTime = create_time;

      // 根据uid修改这条记录
      const result = await ctx.service.webUser.updateWebUserByUid(params);
      if (result) {
        ctx.success();

        /* 保存 timeLine */
        await this.ctx.service.timeLine.saveTimeLine({
          uuid: generateUuid(),
          user_name: this.ctx.request.header.username,
          user_id: this.ctx.request.header.userid,
          method: 'update',
          database_name: 't_web_user',
          item_name: nickName,
          create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    }

  }


  async queryWebUserAll() {
    const { ctx } = this;
    console.log(ctx.request.body, 'ctx.request.body');
    const result = await ctx.service.webUser.queryWebUserAll();
    ctx.success(result);
  }

  async webUserInfo() {

    const { ctx } = this;
    // const { email } = ctx.request.body;
    // const res = await ctx.service.webUser.queryUserByEmail(email);
    // console.log(ctx.request.body, 'ctx.request.body')
    // console.log('获取webUser信息');
    // console.log(res);
    console.info("🚀 ~ file:webUser method:webUserInfo line:674 -----ctx.success(ctx.state.user)", ctx.state.user)
    // res.user_password = '';
    ctx.success(ctx.state.user)
    // ctx.success(res);
  }
}

module.exports = WebUserController;
