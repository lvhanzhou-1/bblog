// const {defineConfig} = require('@vue/cli-service')
const path = require("path");
module.exports = {
    publicPath: './',
    outputDir: 'dist',
    transpileDependencies: true,
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        }
    },
// 开启代理服务器
//     devServer: {
//         proxy: {
//             '/api': {
//                 target: "http://43.143.71.199:7001", // 这里就是写我们进行访问的后台api
//                 pathRewrite: {'^/api': ''}, // 这里就是将我们的请求url进行重写，让后台接收到我们的请求地址中没有我们前端进行配置的这个头api
//
//                 ws:true,
//                 changeOrigin: true,
//             },
//             // 如果还需要访问其他的api，可以在这里继续进行配置
//         }
//     }


}
