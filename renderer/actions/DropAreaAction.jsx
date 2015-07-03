import remote from 'remote';

import dispatcher from '../dispatcher';
import { ActionTypes as DropAreaActionTypes } from '../constants/DropAreaConstants';

export default {

  /**
   * @private
   */
  dropFiles(event) {
    log('dropFiles');

    let files = [];

    for (let i = 0, len = event.dataTransfer.files.length; i < len; ++i) {
      files[i] = event.dataTransfer.files[i].path;
    }

    log(files);

    dispatcher.dispatch({
      type: DropAreaActionTypes.GET_FILES,
      files,
    });
  },

  /**
   * @private
   */
  uploadFiles(event) {
    let mainWindow = remote.getCurrentWindow();

    mainWindow.on('upload-image-files', function() {
      let app = remote.require('app'),
          dialog = remote.require('dialog');

      dialog.showOpenDialog(mainWindow, {
        title: 'upload image file(s)',
        defaultPath: app.getPath('userDesktop'),
        filters: [
          {
            name: 'images',
            extensions: [
              'gif', 'jpg', 'jpeg', 'png', 'svg',
            ],
          },
        ],
        properties: ['openFile', 'multiSelections'],
      }, function(files) {
        log(files);

        if (!Array.isArray(files)) {
          return;
        }

        dispatcher.dispatch({
          type: DropAreaActionTypes.GET_FILES,
          files,
        });
      });
    });
    mainWindow.emit('upload-image-files');
  },

}
