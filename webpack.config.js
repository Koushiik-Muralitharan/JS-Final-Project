const path = require('path');


module.exports = {
  // Entry point of the application
  mode: 'development',
  devtool: 'source-map',
  entry: {
    signup: './signup.ts',
    signin: './signin.ts',
    main: './MainPage.ts',
  },
  // Output configuration
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, ''),
  },

  // Module rules for processing different file types
  module: {
    rules: [
      // TypeScript files
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'web',

  // Resolve file extensions
  resolve: {
    extensions: ['.ts', '.js'],
  },
  
};
