let remote = global.require('remote');

let EventEmitter = require('events').EventEmitter;

let ipcPromise = require('ipc-promise'),
    keymirror = require('keymirror'),
    objectAssign = require('object-assign'),
    dispatcher = require('../dispatcher'),
    DropAreaConstants = require('../constants/DropAreaConstants');

let DropAreaActionTypes = DropAreaConstants.ActionTypes;

let events = keymirror({
  processing: null,
  success: null,
  failure: null,
  finish: null,
});

let OptimizeImageStore = objectAssign({}, EventEmitter.prototype, {

  emitProcessing() {
    this.emit(events.processing);
  },

  addProcessingListener(callback) {
    this.on(events.processing, callback);
  },

  removeProcessingListener(callback) {
    this.removeListener(events.processing, callback);
  },

  //----------------------------------------------------------------------------

  emitSuccess() {
    this.emit(events.success);
  },

  addSuccessListener(callback) {
    this.on(events.success, callback);
  },

  removeSuccessListener(callback) {
    this.removeListener(events.success, callback);
  },

  //----------------------------------------------------------------------------

  emitFailure() {
    this.emit(events.failure);
  },

  addFailureListener(callback) {
    this.on(events.failure, callback);
  },

  removeFailureListener(callback) {
    this.removeListener(events.failure, callback);
  },

  //----------------------------------------------------------------------------

  emitFinish() {
    this.emit(events.finish);
  },

  addFinishListener(callback) {
    this.on(events.finish, callback);
  },

  removeFinishListener(callback) {
    this.removeListener(events.finish, callback);
  },

});

/**
 * @private
 */
function optimizeImage(files) {
  log('optimizeImage', files);

  Promise
    .resolve()
    .then(function() {
      let app = remote.require('app'),
          path = app.getPath('userDesktop');

      log(path);

      OptimizeImageStore.emitProcessing();

      return ipcPromise.send('optimize-image', {
        src: files,
        dest: path,
      });
    })
    .then(function(optimizedFiles) {
      log(arguments);
      OptimizeImageStore.emitSuccess();
      OptimizeImageStore.emitFinish();
    })
    .catch(function(err) {
      console.error(err);
      OptimizeImageStore.emitFailure();
      OptimizeImageStore.emitFinish();
    });
}

OptimizeImageStore.dispatchToken = dispatcher.register(function(action) {
  log('dispatcher.register', arguments);

  switch (action.type) {
    case DropAreaActionTypes.GET_FILES:
      log(DropAreaActionTypes.GET_FILES);
      optimizeImage(action.files);
      break;
  }
});

module.exports = OptimizeImageStore;
