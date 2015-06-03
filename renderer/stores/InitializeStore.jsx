let EventEmitter = require('events').EventEmitter;

let keymirror = require('keymirror'),
    objectAssign = require('object-assign'),
    dispatcher = require('../dispatcher'),
    MinifyImageConstants = require('../constants/MinifyImageConstants');

let MinifyImageActionTypes = MinifyImageConstants.ActionTypes;

let events = keymirror({
  initializing: null,
  initialized: null,
});

let InitializeStore = objectAssign({}, EventEmitter.prototype, {

  emitInitializing() {
    this.emit(events.initializing);
  },

  addInitializingListener(callback) {
    this.on(events.initializing, callback);
  },

  removeInitializingListener(callback) {
    this.removeListener(events.initializing, callback);
  },

  //----------------------------------------------------------------------------

  emitInitialized() {
    this.emit(events.initialized);
  },

  addInitializedListener(callback) {
    this.on(events.initialized, callback);
  },

  removeInitializedListener(callback) {
    this.removeListener(events.initialized, callback);
  },

});

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

/**
 * @private
 */
function initialize() {
  InitializeStore.emitInitializing();

  setEvents();

  InitializeStore.emitInitialized();
}

InitializeStore.dispatchToken = dispatcher.register(function(action) {
  log('dispatcher.register', arguments);

  switch (action.type) {
    case MinifyImageActionTypes.INITIALIZE:
      log(MinifyImageActionTypes.INITIALIZE);
      initialize();
      break;
  }
});

module.exports = InitializeStore;
