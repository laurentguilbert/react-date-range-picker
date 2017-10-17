var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/theme/default.less',
    './playground/app.js'
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  devServer: {
    contentBase: './playground/',
    watchOptions: {
      poll: true
    }
  }
};
