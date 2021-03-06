webpack = require 'webpack'

module.exports =

  context: __dirname

  entry:
    index: './renderer/index.jsx'
    bundle: [
      'co'
      'flux'
      'keymirror'
      'ipc-promise'
      'object-assign'
      'radium'
      'react'
    ]

  output:
    path: './renderer'
    publicPath: './'
    filename: '[name].js'
    chunkFilename: 'chunk-[id].js'

  module:
    loaders: [
      { test: /\.jsx$/, exclude: /bower_components|node_modules/, loader: 'babel?stage=0&blacklist[]=regenerator' }
      { test: /\.png$/, exclude: /bower_components|node_modules/, loader: 'url' }
    ]
    noParse: [
      /ipc-promise/
    ]

  resolve:
    extensions: [
      ''
      '.jsx'
      '.js'
    ]
    modulesDirectories: [
      'node_modules'
      'bower_components'
    ]

  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
    )
    new webpack.NoErrorsPlugin
    new webpack.IgnorePlugin(/vertx/)
    new webpack.optimize.DedupePlugin
    new webpack.optimize.AggressiveMergingPlugin
    new webpack.optimize.CommonsChunkPlugin('bundle', 'bundle.js')
  ].concat(
    if process.argv.some (arg) ->
      /^(?:-p|--optimize-minimize)$/.test(arg)
    then [
      new webpack.DefinePlugin(
        log: -> return
      )
      new webpack.optimize.UglifyJsPlugin(
        output: comments: require('uglify-save-license')
      )
    ]
    else [
      new webpack.DefinePlugin(
        log: -> console.log.apply(console, arguments)
      )
    ]
  )
