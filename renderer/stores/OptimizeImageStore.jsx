import { EventEmitter } from 'events';
import remote from 'remote';

import ipcPromise from 'ipc-promise';
import keymirror from 'keymirror';

import dispatcher from '../dispatcher';
import { ActionTypes as DropAreaActionTypes } from '../constants/DropAreaConstants';

let events = keymirror({
  processing: null,
  success: null,
  failure: null,
  finish: null,
});

class OptimizeImageStore extends EventEmitter {

  dispatchToken = dispatcher.register(this.handleDispatch.bind(this));

  handleDispatch(action) {
    log('handleDispatch', arguments);

    switch (action.type) {
      case DropAreaActionTypes.GET_FILES:
        log(DropAreaActionTypes.GET_FILES);
        this.optimizeImage(action.files);
        break;
    }
  }

  /**
   * @param {String[]} files
   */
  optimizeImage(files) {
    log('optimizeImage', files);
  
    Promise
      .resolve()
      .then(
        () => {
          let app = remote.require('app'),
              path = app.getPath('userDesktop');
    
          log(path);
    
          this.emitProcessing();
    
          return ipcPromise.send('optimize-image', {
            src: files,
            dest: path,
          });
        }
      )
      .then(
        (optimizedFiles) => {
          log(arguments);
          this.emitSuccess();
          this.emitFinish();
        }
      )
      .catch(
        (err) => {
          console.error(err);
          this.emitFailure();
          this.emitFinish();
        }
      );
  }

  //----------------------------------------------------------------------------

  emitProcessing() {
    this.emit(events.processing);
  }

  addProcessingListener(callback) {
    this.on(events.processing, callback);
  }

  removeProcessingListener(callback) {
    this.removeListener(events.processing, callback);
  }

  //----------------------------------------------------------------------------

  emitSuccess() {
    this.emit(events.success);
  }

  addSuccessListener(callback) {
    this.on(events.success, callback);
  }

  removeSuccessListener(callback) {
    this.removeListener(events.success, callback);
  }

  //----------------------------------------------------------------------------

  emitFailure() {
    this.emit(events.failure);
  }

  addFailureListener(callback) {
    this.on(events.failure, callback);
  }

  removeFailureListener(callback) {
    this.removeListener(events.failure, callback);
  }

  //----------------------------------------------------------------------------

  emitFinish() {
    this.emit(events.finish);
  }

  addFinishListener(callback) {
    this.on(events.finish, callback);
  }

  removeFinishListener(callback) {
    this.removeListener(events.finish, callback);
  }
}

export default new OptimizeImageStore();
