const path = require('path');


module.exports = {
  entry: './frontend/index.js',
  output: {
    path: path.join(__dirname, './posts/static/posts'),
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        // loaders should be listed in this order otherwise css doesn't work
        use: ['style-loader', 'css-loader']
      },
    ]
  }
};