import React from 'react';

import DropAreaAction from '../../actions/DropAreaAction';

import CSS from './css.scss';
import RES from './res';

export default class DropArea extends React.Component {

  /**
   * @private
   */
  cancelEvent(event) {
    log('cancelEvent');
    event.preventDefault();
  }

  /**
   * @private
   */
  dropFiles(event) {
    log('dropFiles');
    DropAreaAction.dropFiles(event);
  }

  /**
   * @private
   */
  uploadFiles(event) {
    log('uploadFiles');
    DropAreaAction.uploadFiles(event);
  }

  //------------------------------------------------------------------------------

  render() {
    return (
      <section
        className={CSS.section}
        onDrop={this.dropFiles}
        onDragOver={this.cancelEvent}
        onDragLeave={this.cancelEvent}
        onDragEnd={this.cancelEvent}>
        <div>
          <p className={CSS.drop_here}>ここに画像をドロップ</p>
          <p className={CSS.extension_list}>gif, jpg, png, svg</p>
          <img src={RES.image.background} alt="" />
          <p className={CSS.drop_or}>または</p>
          <button
            type="button"
            onClick={this.uploadFiles}>参照してアップロード</button>
        </div>
      </section>
    );
  }

}
