let dispatcher = require('../dispatcher'),
    MinifyImageConstants = require('../constants/MinifyImageConstants');

let MinifyImageActionTypes = MinifyImageConstants.ActionTypes;

let MinifyImageAction = {

  /**
   * @private
   */
  initialize() {
    log('initialize');

    dispatcher.dispatch({
      type: MinifyImageActionTypes.INITIALIZE,
    });
  },

};

module.exports = MinifyImageAction;
