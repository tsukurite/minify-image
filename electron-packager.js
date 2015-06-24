#!/usr/bin/env node --harmony_arrow_functions

'use strict';

var fs = require('fs'),
    path = require('path'),
    co = require('co'),
    electronPackager = require('electron-packager'),
    glob = require('glob'),
    objectAssign = require('object-assign'),
    rimraf = require('rimraf'),
    thunkify = require('thunkify'),
    packageData = require('./package');

/**
 * wrpping with Electron
 *
 * @param {Object} baseOptions
 * @param {Object} overwriteOptions
 * @return {Promise}
 */
function packaging(baseOptions, overwriteOptions) {
  var options = objectAssign({}, baseOptions, overwriteOptions);

  return co(function*() {
    return yield thunkify(electronPackager).call(electronPackager, options);
  });
}

/**
 * download for imagemin moudule
 *
 * @param {String} vendorDirPath
 * @return {Promise}
 */
function download(vendorDirPath) {
  var pluginModule = require(`${vendorDirPath}/../lib`),
      fetch = thunkify(pluginModule.download.bind(pluginModule));

  return co(function*() {
    return yield fetch();
  });
}

/**
 * parallel download for imagemin modules
 *
 * @param {String[]} vendorDirPaths
 * @return {Function[]}
 */
function parallelDownload(vendorDirPaths) {
  return vendorDirPaths.map(
    (vendorDirPath) => download(vendorDirPath)
  );
}

/**
 * remove downloaded binaries and download binaries for target platform
 *
 * @param {String} releaseDir
 * @param {Promise}
 */
function setupBinaries(releaseDir) {
  return co(function*() {
    var vendorDirGlob = `${releaseDir}/**/vendor`,
        vendorDirs = yield thunkify(glob).call(glob, vendorDirGlob);

    // remove installed module's binaries
    yield vendorDirs.map(
      (vendorDir) => thunkify(rimraf).call(rimraf, vendorDir)
    );

    // download to binaries for target platform
    return yield parallelDownload(vendorDirs);
  });
}

/**
 * process faker
 *
 * @class
 */
function ProcessFaker() {
  this._originalProcess = process;
  this._originalDescripters = {};
}

/**
 * fake property
 *
 * @param {String} propertyName
 * @param {*} fakeValue
 */
ProcessFaker.prototype.fake = function fake(propertyName, fakeValue) {
  var originalDescripter =
    Object.getOwnPropertyDescriptor(this._originalProcess, propertyName);

  this._originalDescripters[propertyName] = originalDescripter;
  Object.defineProperty(process, propertyName, fakeValue);
};

/**
 * revert faked property.
 *
 * @param {String} propertyName
 */
ProcessFaker.prototype.unfake = function unfake(propertyName) {
  var originalDescripter =
    this._originalDescripters[propertyName];

  Object.defineProperty(process, propertyName, originalDescripter);
  this._originalDescripters[propertyName] = null;
};

co(function*() {
  const RELEASES_DIR = path.join(__dirname, '/releases');

  var options = {
    dir: __dirname,
    name: 'minify-image',
    arch: 'x64',
    version: '0.28.1',
    prune: true,
    ignore: [
      // common
      '\.(?:coffee|jade|jsx|scss)$',

      // development files
      'webpack.config.js$',

      // MEMO: fail when prune option is true
      // 'package.json$',

      // empty dirs
      'renderer/actions',
      'renderer/components',
      'renderer/constants',
      'renderer/dispatcher',
      'renderer/stores',

      // text files
      'LICENSE$',
      'README\.md$',
      'HISTORY\.md$',

      // this file
      path.basename(__filename),

      // releases dir
      RELEASES_DIR,
    ],
    'app-version': packageData.version,
  };

  // packaging
  // TODO: parallel execution
  console.log('packaged to', yield packaging(options, {
    platform: 'win32',
    out: RELEASES_DIR,
  }));
  console.log('packaged to', yield packaging(options, {
    platform: 'linux',
    out: path.normalize(`${RELEASES_DIR}/minify-image-linux-x86_64`),
  }));
  console.log('packaged to', yield packaging(options, {
    platform: 'darwin',
    out: path.normalize(`${RELEASES_DIR}/minify-image-osx-x86_64`),
  }));

  // rename directory
  yield thunkify(fs.rename).call(
    fs,
    path.normalize(`${RELEASES_DIR}/minify-image-win32`),
    path.normalize(`${RELEASES_DIR}/minify-image-win-x86_64`)
  );

  //----------------------------------------------------------------------------

  var processFaker = new ProcessFaker();

  try {
    // fake process.arch
    processFaker.fake('arch', { value: options.arch });

    // fake process.platform
    processFaker.fake('platform', { value: 'win32' });
    yield setupBinaries(
      path.normalize(`${RELEASES_DIR}/minify-image-win-x86_64`));

    processFaker.fake('platform', { value: 'linux' });
    yield setupBinaries(
      path.normalize(`${RELEASES_DIR}/minify-image-linux-x86_64`));

    processFaker.fake('platform', { value: 'darwin' });
    yield setupBinaries(
      path.normalize(`${RELEASES_DIR}/minify-image-osx-x86_64`));
  } finally {
    // revert faked properties
    processFaker.unfake('arch');
    processFaker.unfake('platform');
  }
}).then(function() {
  console.log('done');
}).catch(function(err) {
  console.error('error:');
  console.error(err.stack);
});
