const path = require('path')

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './src/background.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'background.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
}
