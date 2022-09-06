/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
// mysql配置
const { database } = require('../app/constant/config');

module.exports = appInfo => {
  /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
  const config = exports = {};

  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  config.multipart = {
    mode: 'file',
    whitelist: [ // images
      '.jpg', '.jpeg', // image/jpeg
      '.png', // image/png, image/x-png
      '.gif', // image/gif
      '.bmp', // image/bmp
      '.wbmp', // image/vnd.wap.wbmp
      '.webp',
      '.tif',
      '.psd',
      // text
      '.svg',
      '.js', '.jsx',
      '.json',
      '.css', '.less',
      '.html', '.htm',
      '.xml',
      // tar
      '.zip',
      '.gz', '.tgz', '.gzip',
      // video
      '.mp3',
      '.mp4',
      '.avi',
      'md' ],

    fields: '100',


  };


  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1658926635891_6497';

  // add your middleware config here
  config.middleware = [];


  config.jwt = {
    secret: '123456', // 可自行定义
  };
  // post
  // 跨站请求伪造
  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.cors = {
    // 匹配规则  域名+端口  *则为全匹配
    // origin: 'http://localhost:8080',
    origin: '*',

    // 匹配请求方式
    // allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    allowMethods: '*',
  };

  // 单数据库信息配置
  config.mysql = {
    client: {
      // host
      host: database.host,
      // 端口号
      port: database.port,
      // 用户名
      user: database.user,
      // 密码
      password: database.password,
      // 数据库名
      database: database.database,
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };


  return {
    ...config,
    ...userConfig,
  };
};
