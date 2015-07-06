let debug = require('debug'),
    Imagemin = require('imagemin'),
    ipcPromise = require('ipc-promise'),
    rename = require('gulp-rename');

let log = debug('main:optimize-image');

/**
 * optimize images.
 *
 * @param {String} src
 * @param {String} dest
 * @param {String} [filename]
 * @return {Promise}
 */
function optimizeImage(src, dest, filename) {
  log('optimizeImage', arguments);

  return new Promise(function(resolve, reject) {
    let imagemin = new Imagemin();

    // set configs
    imagemin
      .src(src)
      .dest(dest)
      .use(Imagemin.gifsicle({ interlaced: true }))
      .use(Imagemin.jpegtran({ progressive: true }))
      .use(Imagemin.optipng({ optimizationLevel: 3 }))
      .use(Imagemin.svgo());

    if (filename) {
      imagemin.use(rename(filename));
    }

    imagemin.run(function(err, files) {
      (err) ? reject({ stack: err.stack }) : resolve({ files });
    });
  });
}

ipcPromise.on('optimize-image', function(params) {
  log('optimize-image', arguments);

  let { src, dest, filename } = params;

  return optimizeImage(src, dest, filename);
});

module.exports = {
  optimizeImage,
};
