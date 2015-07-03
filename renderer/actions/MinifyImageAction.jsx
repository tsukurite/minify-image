import dispatcher from '../dispatcher';
import { ActionTypes as MinifyImageActionTypes } from '../constants/MinifyImageConstants';

export default {

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
