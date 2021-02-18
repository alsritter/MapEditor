const path = require('path');

module.exports = {
  entry: './src/js/tileController.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        // use 表示使用 'babel-loader' 加载器来处理 .js 文件；
        // exclude 为排除项，表示 babel-loader 不需要处理 node_modules 中的 js 文件
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
