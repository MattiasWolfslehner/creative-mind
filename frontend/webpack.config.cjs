// webpack.config.cjs for JS and JSON (default), TS, HTML, CSS, SCSS, TailwindCSS
// https://webpack.js.org

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExecaPlugin = require('execa-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const path = require('path');

const components = glob
  .globSync('./public/lib/components/**.ts')
  .reduce(function (obj, el) {
    obj[path.parse(el).name] = `./${el}`;
    return obj;
  }, {});

const DEV_MODE = process.env.NODE_ENV !== 'production';
const BUILD_DOCS = process.env.BUILD_DOCS === 'true' || false;

module.exports = {
  mode: DEV_MODE ? 'development' : 'production', // development, production(default) or none
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    proxy: {
      '/api': `http://localhost:8080`,
    },
    historyApiFallback: true,
    compress: true,
    port: 9000,
  },
  devtool: DEV_MODE ? 'inline-source-map' : false,
  entry: {
    // start bundling from here
    brainwriting: './public/lib/script/pages/brainwriting.js',
    home2: './public/lib/script/pages/index_2.js',
    room: './public/lib/script/pages/room.ts',
    ...components,
  },
  output: {
    // bundle to this location
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[name].js',
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
    },
  },
  plugins: [
    // https://webpack.js.org/plugins/
    new HtmlWebpackPlugin({
      // minifies html and adds imports
      filename: 'brainwriting/index.html',
      template: 'public/routes/brainwriting/index.html',
      chunks: ['brainwriting'], // only include the 'home' chunk
    }),
    new HtmlWebpackPlugin({
      // minifies html and adds imports
      filename: 'index_2.html',
      template: 'public/routes/index_2.html',
      chunks: ['home2'], // only include the 'home' chunk
    }),
    new HtmlWebpackPlugin({
      // minifies html and adds imports
      filename: 'room/index.html',
      template: 'public/routes/room/index.html',
      chunks: ['room'], // only include the 'room' chunk
    }),
    new MiniCssExtractPlugin({
      // minifies css and splits it
      filename: DEV_MODE ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: DEV_MODE ? '[id].css' : '[id].[contenthash].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/static'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(
            __dirname,
            'node_modules/@shoelace-style/shoelace/dist/assets',
          ),
          to: path.resolve(__dirname, 'dist/shoelace/assets'),
        },
      ],
    }),
    BUILD_DOCS &&
      new ExecaPlugin({
        onBeforeRun: [
          {
            args: [],
            cmd: 'node build-docs.cjs',
            options: {
              cwd: process.cwd(),
            },
          },
        ],
      }),
  ],
  module: {
    // loaders, so that webpack understands more than JavaScript and JSON
    rules: [
      {
        // static assets (Images, Fonts, etc.)
        test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
        type: 'asset/resource',
      },
      {
        // static assets (Images, Fonts, etc.)
        test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        // TS (`.ts`, `.cts`, `.mts` or `.tsx`)
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader',
      },
      {
        // SCSS/SASS
        test: /\.s[ac]ss$/i,
        use: [
          DEV_MODE ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        // CSS
        test: /\.css$/i, // type to transform
        use: [
          DEV_MODE ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader', // TailwindCSS, Autoprefixer, etc. (postcss.config.cjs)
            options: {
              postcssOptions: {
                plugins: [
                  // bundle optimization, asset management, injection of env variables...
                  ['postcss-preset-env', {}],
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
