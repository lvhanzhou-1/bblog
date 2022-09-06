const {defineConfig} = require('@vue/cli-service')

const path = require('path')

module.exports = defineConfig({
    publicPath: '/',
    outputDir: 'dist',
    transpileDependencies: true,
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        }
    }
})
