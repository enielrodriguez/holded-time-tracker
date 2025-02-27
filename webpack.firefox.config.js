const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    content: './src/firefox/content.js',
    background: './src/firefox/background.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/firefox'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: './src/firefox/manifest.json', 
          to: 'manifest.json' 
        },
        { 
          from: './src/common/icons', 
          to: 'icons' 
        }
      ],
    }),
  ],
};
