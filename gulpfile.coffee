gulp    = require 'gulp'
jade    = require 'gulp-jade'
sass    = require 'gulp-sass'
babel   = require 'gulp-babel'
watch   = require 'gulp-watch'
coffee  = require 'gulp-coffee'
cached  = require 'gulp-cached'
notify  = require 'gulp-notify'
plumber = require 'gulp-plumber'

#-- for renderer process -------------------------------------------------------

rendererDir = './renderer'

jadeInput = "#{rendererDir}/**/*.jade"
sassInput = "#{rendererDir}/**/*.scss"

jadeOutput = rendererDir
sassOutput = rendererDir

jadeOptions =
  debug: false
  pretty: false
  basedir: rendererDir
sassOptions =
  outputStyle: 'compressed'
  sourceComments: false

gulp.task 'jade', ->
  gulp
    .src(jadeInput)
    .pipe(plumber(errorHandler: notify.onError('<%= error.message %>')))
    .pipe(cached('jade'))
    .pipe(jade(jadeOptions))
    .pipe(gulp.dest(jadeOutput))

gulp.task 'sass', ->
  gulp
    .src(sassInput)
    .pipe(plumber(errorHandler: notify.onError('<%= error.message %>')))
    .pipe(cached('sass'))
    .pipe(sass(sassOptions))
    .pipe(gulp.dest(sassOutput))

#-- for main process -----------------------------------------------------------

mainDir = './main'

babelInput = "#{mainDir}/**/*.jsx"
coffeeInput = "#{mainDir}/**/*.coffee"

babelOutput = mainDir
coffeeOutput = mainDir

babelOptions =
  stage: 0
  blacklist: [
    'regenerator'
  ]
coffeeOptions =
  bare: true

gulp.task 'babel', ->
  gulp
    .src(babelInput)
    .pipe(plumber(errorHandler: notify.onError('<%= error.message %>')))
    .pipe(cached('babel'))
    .pipe(babel(babelOptions))
    .pipe(gulp.dest(babelOutput))

gulp.task 'coffee', ->
  gulp
    .src(coffeeInput)
    .pipe(plumber(errorHandler: notify.onError('<%= error.message %>')))
    .pipe(cached('coffee'))
    .pipe(coffee(coffeeOptions))
    .pipe(gulp.dest(coffeeOutput))

#-- for development ------------------------------------------------------------

gulp.task 'watch', ->
  watch(jadeInput, -> gulp.start 'jade')
  watch(sassInput, -> gulp.start 'sass')
  watch(babelInput, -> gulp.start 'babel')
  watch(coffeeInput, -> gulp.start 'coffee')
  return

#-- aliases --------------------------------------------------------------------

gulp.task 'compile', ['jade', 'sass', 'babel', 'coffee']
gulp.task 'develop', ['compile', 'watch']
gulp.task 'default', ['develop']
