// mysql配置
const database = {
    host: "localhost", // 连接的服务器（代码托管到线上后，需改为内网IP，而非外网）
    port: 3307, // mysql服务运行的端口
    database: "pupubblog", // 连接的数据库
    user: "root", // 用户名
    password: "123456", // 用户密码
    // password: "LVhanzhou1997", // 用户密码
};


/**
 * 1、如果是本地运行
 *  http://localhost:7001
 * 2、如果是部署到服务器，正式生产环境
 *  http://43.143.71.199:7001
 */
const baseUrl = "http://localhost:7001";
// const baseUrl = "http://43.143.71.199:7001";


const keys = "secret"; // 设置token时的key
// 后台管理员登录默认失效时间
const expires = 3600 * 2; // token默认过期时间，单位是秒 3600s就是一小时
// 单位是KB 最大上传文件大小
const maxFileSize = 5 * 1024 * 1024; // 5M 最大上传文件大小  1M = 1024 KB  1 KB = 1024 Bytes  1 Bytes = 8 Bit
const restPassword = "123123"; // 默认重置的密码
/**
 * Gitee登录相关参数 https://www.eoway.cn/article/1603360705.html
 *
 * 1、如果是本地运行
 *  client_id: '26444783acc7336684cf1e73d6ffd4140c774100f651ae0d0979017cbc4fc1e3',
 *  client_secret: '1f7aed7978e13824bc64b6bd86d0a91a79926f8a83b4e175d70a5e16a30a063c',
 *
 * 2、如果是线上运行，正式环境
 *  client_id: '3b96ac6294c2b72b5a665049554ad79a25da6f2e1e68ab4e2a4d554c3aa495bf',
 *  client_secret: '0db54df0cac1e7e756b4a365b19e8fb548b1c195ddd179d4c8788ad53028be2f',
 *
 * 2、如果是线上演示环境
 *  client_id: 'd6f106cf3b5e3c5f2daf58b7174219c1b818de1ce3d2476e2a6459a15f7a056d',
 *  client_secret: '03606ba9c4cc7b47b0844c97d67a5f9b26f08d5c27703074f51c471c310c3187',
 *
 */
const giteeLogin = {
    client_id: "515c141d9ef70ab32319c93c7233c6f859d979d1bf99404961bb1168dcf8e050",
    client_secret:
        "c5338141b02bf02fe7c8e5f512a9e72b1c81c32686a050d0c9eeed67cddd8b31",
    expires: 7200, // token默认过期时间，单位是秒 3600s就是一小时
};

/*
 * 1. 线上环境配置跨域，配置成一个正则表达式
 *  /bnbiye.cn/
 * 2. 本地启动
 * /localhost/
 * */
const cosWhiteList = /localhost/;

/* 配置邮箱*/
const nodemailerConfig = {
    // user_email:'1033007574@qq.com',
    user_email: "lhz7574@qq.com",
    auth_code: "zxxqzjuiwugebaja",
    service: "qq", // 调用qq服务器
    secureConnection: true, // 启动SSL
    port: 465, // 端口就是465
    expires: 600,
    codeLength: 6,
};

module.exports = {
    database,
    baseUrl,
    keys,
    expires,
    restPassword,
    maxFileSize,
    giteeLogin,
    cosWhiteList,
    nodemailerConfig,
};
