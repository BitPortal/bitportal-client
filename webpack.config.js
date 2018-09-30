const webpack = require('webpack')
const fs = require('fs')
const { resolve, join } = require('path')
const DotENV = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HappyPack = require('happypack')
const nodeExternals = require('webpack-node-externals')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const { ifProduction, ifNotProduction, ifNotTest, ifTest } = getIfUtils(process.env.NODE_ENV)
const happyThreadPool = HappyPack.ThreadPool({ size: 5 })

const baseConfig = {
  mode: ifProduction('production', 'development'),
  output: {
    webassemblyModuleFilename: ifProduction('scripts/[modulehash].module.wasm?v=[modulehash]', 'scripts/[modulehash].module.wasm'),
    chunkFilename: ifProduction('scripts/[name].chunk.js?v=[chunkhash]', 'scripts/[name].chunk.js')
  },
  resolve: {
    modules: [
      resolve('shared'),
      resolve('browser'),
      resolve('desktop'),
      resolve('server'),
      resolve('extension'),
      'node_modules'
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    mainFiles: ['index.web', 'index']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: false
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: [
          resolve(__dirname, 'node_modules'),
          resolve(__dirname, 'shared/resources/scripts'),
          resolve(__dirname, 'shared/resources/charting_library'),
          resolve(__dirname, 'shared/screens'),
          resolve(__dirname, 'shared/navigators')
        ]
      },
      {
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        enforce: 'pre',
        exclude: [
          resolve(__dirname, 'node_modules'),
          resolve(__dirname, 'shared/screens'),
          resolve(__dirname, 'shared/navigators')
        ]
      },
      {
		test: /\.wasm$/,
		type: 'webassembly/experimental'
	  },
      {
        test: /\.(t|j)sx?$/,
        exclude: [
          resolve(__dirname, 'node_modules'),
          resolve(__dirname, 'shared/resources/scripts'),
          resolve(__dirname, 'shared/resources/charting_library'),
          resolve(__dirname, 'shared/screens'),
          resolve(__dirname, 'shared/navigators')
        ],
        use: 'happypack/loader?id=scripts'
      },
      {
        test: /\.css$/,
        include: resolve(__dirname, 'shared'),
        use: removeEmpty([ifNotTest(ExtractCssChunks.loader), 'happypack/loader?id=styles'])
      },
      {
        test: /\.css$/,
        exclude: resolve(__dirname, 'shared'),
        use: removeEmpty([ifNotTest(ExtractCssChunks.loader), 'happypack/loader?id=externalStyles'])
      },
      {
        test: /\.(ttf|eot|otf|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        include: resolve(__dirname, 'shared/resources/fonts'),
        loader: 'url-loader',
        options: {
          ...(process.env.TARGET !== 'electron-renderer' ? { limit: 1024 } : null),
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(ico|png|jpg|svg|gif)$/,
        include: resolve(__dirname, 'shared/resources/images'),
        loader: 'url-loader',
        options: {
          ...(process.env.TARGET !== 'electron-renderer' ? { limit: 10240 } : null),
          name: 'images/[name].[ext]?v=[hash:base64:5]'
        }
      }
    ]
  },
  plugins: removeEmpty([
    new DotENV({
      path: resolve(__dirname, `.env.${process.env.APP_ENV}`),
      systemvars: true
    }),
    ifNotTest(new ExtractCssChunks({
      filename: ifProduction('styles/bundle.css?v=[hash]', 'styles/bundle.css'),
      chunkFilename: ifProduction('styles/[name].chunk.css?v=[chunkhash]', 'styles/[name].chunk.css')
    })),
    new HappyPack({
      id: 'scripts',
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: 'babel-loader',
          query: {
            babelrc: false,
            presets: removeEmpty([
              ['env', { loose: true, modules: false }],
              'react',
              'stage-2',
              ifProduction('react-optimize')
            ]),
            plugins: removeEmpty([
              'syntax-dynamic-import',
              'transform-class-properties',
              'transform-decorators-legacy',
              'react-hot-loader/babel',
              'transform-runtime',
              'react-hot-loader/babel',
              ifTest('istanbul')
            ])
          }
        },
        {
          loader: 'ts-loader',
          query: { happyPackMode: true }
        }
      ]
    }),
    new HappyPack({
      id: 'styles',
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: ifNotTest('css-loader', 'css-loader/locals'),
          query: {
            minimize: true,
            modules: true,
            sourceMap: true,
            importLoaders: 1,
            localIdentName: '[local]_[hash:base64:5]'
          }
        },
        {
          loader: 'postcss-loader'
        }
      ]
    }),
    new HappyPack({
      id: 'externalStyles',
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: ifNotTest('css-loader', 'css-loader/locals'),
          query: { minimize: true }
        }
      ]
    }),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: resolve(__dirname, './tsconfig.json'),
      checkSyntacticErrors: true
    }),
    new CopyWebpackPlugin([
      {
        from: join(__dirname, 'shared/resources/scripts'),
        to: join(__dirname, 'static/web/scripts')
      }
    ], { copyUnmodified: true })
  ])
}

const browserConfig = {
  ...baseConfig,
  context: resolve('browser'),
  entry: ifNotProduction([
    'react-hot-loader/patch',
    './index.tsx'
  ], './index.tsx'),
  output: {
    ...baseConfig.output,
    path: resolve('static/web'),
    filename: ifProduction('scripts/bundle.js?v=[hash]', 'scripts/bundle.js'),
    publicPath: '/'
  },
  optimization: {
	splitChunks: {
	  cacheGroups: {
		commons: {
		  chunks: 'initial',
		  minChunks: 2,
		  maxInitialRequests: 5,
		  minSize: 0
		},
		vendor: {
		  test: /node_modules/,
		  chunks: 'initial',
		  name: 'vendor',
		  priority: 10,
		  enforce: true
		}
	  }
	}
  },
  plugins: removeEmpty([
    ...baseConfig.plugins,
    ifNotProduction(new webpack.HotModuleReplacementPlugin()),
    ifProduction(new webpack.NormalModuleReplacementPlugin(/routes\/sync/, 'routes/async')),
    ifProduction(new ManifestPlugin({ isChunk: true })),
    new HtmlWebpackPlugin({
      inject: false,
      minify: { collapseWhitespace: true },
      template: 'index.html',
      appMountId: 'app',
      mobile: true
    }),
  ]),
  devServer: {
    contentBase: './browser',
    hot: true,
    open: true,
    openPage: ''
  }
}

const serverConfig = {
  ...baseConfig,
  target: 'node',
  context: resolve('server'),
  devtool: false,
  entry: './index.js',
  output: {
    ...baseConfig.output,
    path: resolve('static/web'),
    filename: 'app.js',
    libraryTarget: 'commonjs2',
    publicPath: '/'
  },
  externals: [nodeExternals({ whitelist: ['normalize.css/normalize.css'] })],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.ExtendedAPIPlugin()
  ]
}

const desktopConfig = {
  ...baseConfig,
  target: 'electron-renderer',
  context: resolve('desktop'),
  entry: ifNotProduction([
    'react-hot-loader/patch',
    './index.tsx'
  ], './index.tsx'),
  output: {
    ...baseConfig.output,
    path: resolve('static/desktop'),
    filename: ifProduction('scripts/bundle.js?v=[hash]', 'scripts/bundle.js')
  },
  plugins: removeEmpty([
    ...baseConfig.plugins,
    ifNotProduction(new webpack.HotModuleReplacementPlugin()),
    ifProduction(new ManifestPlugin({ isChunk: true })),
    new HtmlWebpackPlugin({
      inject: false,
      minify: { collapseWhitespace: true },
      template: 'index.html',
      appMountId: 'app',
      mobile: true
    })
  ]),
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          mangle: false
        }
      })
    ]
  }
}

const extensionConfig = {
  ...baseConfig,
  context: resolve('extension'),
  entry: {
    popup: './popup.tsx',
    background: './background.ts',
    content: './content.ts',
    inject: './inject.js'
  },
  resolve: {
    ...baseConfig.resolve,
    mainFiles: ['index.extension', ...baseConfig.resolve.mainFiles]
  },
  output: {
    ...baseConfig.output,
    path: resolve('static/extension'),
    filename: 'scripts/[name].js'
  },
  plugins: removeEmpty([
    ...baseConfig.plugins,
    new HtmlWebpackPlugin({
      inject: false,
      minify: { collapseWhitespace: true },
      template: 'popup.html',
      appMountId: 'app',
      mobile: true,
      chunks: ['popup'],
      filename: 'popup.html'
    }),
    new CopyWebpackPlugin([
      {
        from: join(__dirname, 'extension/manifest.json'),
        to: join(__dirname, 'static/extension/manifest.json')
      }
    ], { copyUnmodified: true })
  ]),
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          mangle: false
        }
      })
    ]
  }
}

const injectConfig = {
  ...baseConfig,
  context: resolve('shared'),
  entry: 'core/scatter/inject.js',
  output: {
    ...baseConfig.output,
    filename: 'inject.js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          mangle: true,
          output: {
            comments: false
          }
        }
      })
    ]
  }
}

const injectIOSConfig = {
  ...injectConfig,
  output: {
    ...injectConfig.output,
    path: resolve('ios/bitportal')
  }
}

const injectAndroidConfig = {
  ...injectConfig,
  output: {
    ...injectConfig.output,
    path: resolve('android/app/src/main/assets/raw')
  }
}

const configs = {
  web: browserConfig,
  node: serverConfig,
  "electron-renderer": desktopConfig,
  extension: extensionConfig,
  injectIOS: injectIOSConfig,
  injectAndroid: injectAndroidConfig
}

module.exports = configs[process.env.TARGET]
