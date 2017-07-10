var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var InertToHTMLPlugin = require('./webpack.plugin.insertToHtml')
var glob = require('glob');
var path = require('path');

var args = process.argv;
var EnvName = args[2].replace('-env=', '');// 环境名称，如: prd | stg | dev ...
console.log('EnvName:' + EnvName);

function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
  });

  return entries;
}

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  resolve: {
    alias: {
      'env': path.resolve(__dirname, '../config/dev.env.js')  
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new InertToHTMLPlugin({
      paths: [path.posix.join(config.dev.assetsPublicPath, 'config/' + EnvName +'.js')]
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    })
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // })
  ]
});

// var pages = getEntry('./src/module/**/*.html');
var pages = module.exports.entry;

for (var pathname in pages) {
    // 配置生成的html文件，定义路径等
    var conf = {
      filename: pathname + '.html',
      // template: pages[pathname],   // 模板路径
      template: './index.html',   // 模板路径
      inject: true,              // js插入位置
      minify: {
        //removeComments: true,
        //collapseWhitespace: true,
        //removeAttributeQuotes: true
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency'
    };
    
    if (/^module\//.test(pathname)) {
      conf.chunks = ['vendor','app', pathname];
      // conf.hash = true;
      module.exports.plugins.push(new HtmlWebpackPlugin(conf));
    }

    
  }
