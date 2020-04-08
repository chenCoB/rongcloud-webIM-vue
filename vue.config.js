module.exports = {
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            scss: {
                // @/ 是 src/ 的别名
                // 注意：在 sass-loader v7 中，这个选项名是 "data"
                prependData: ` 
                @import "@nutui/nutui/dist/styles/index.scss";
                @import "@/assets/scss/custom_theme.scss";
                `
            }
        },
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://im-server.test', //API服务器的地址
                ws: true,  //代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
    }
};
