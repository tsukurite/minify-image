import { EventEmitter } from 'events';

import keymirror from 'keymirror';

import dispatcher from '../dispatcher';
import { ActionTypes as MinifyImageActionTypes } from '../constants/MinifyImageConstants';

let events = keymirror({
  initializing: null,
  initialized: null,
});

class InitializeStore extends EventEmitter {

  dispatchToken = dispatcher.register(this.handleDispatch.bind(this));

  handleDispatch(action) {
    log('handleDispatch', arguments);

    switch (action.type) {
      case MinifyImageActionTypes.INITIALIZE:
        log(MinifyImageActionTypes.INITIALIZE);
        this.initialize();
        break;
    }
  }

  initialize() {
    this.emitInitializing();
    setEvents();
    this.emitInitialized();
  }

  //----------------------------------------------------------------------------

  emitInitializing() {
    this.emit(events.initializing);
  }

  addInitializingListener(callback) {
    this.on(events.initializing, callback);
  }

  removeInitializingListener(callback) {
    this.removeListener(events.initializing, callback);
  }

  //----------------------------------------------------------------------------

  emitInitialized() {
    this.emit(events.initialized);
  }

  addInitializedListener(callback) {
    this.on(events.initialized, callback);
  }

  removeInitializedListener(callback) {
    this.removeListener(events.initialized, callback);
  }

}

/**
 * @private
 */
function setEvents() {
  let cancelEvent = function cancelEvent(event) {
    event.preventDefault();
  };

  // cancel default drop event
  window.addEventListener('drop', cancelEvent, false);
  window.addEventListener('dragover', cancelEvent, false);
  window.addEventListener('dragleave', cancelEvent, false);
  window.addEventListener('dragend', cancelEvent, false);
}

export default new InitializeStore();
