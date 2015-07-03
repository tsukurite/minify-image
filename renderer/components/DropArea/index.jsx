import React from 'react';
import Radium from 'radium';

import DropAreaAction from '../../actions/DropAreaAction';

import CSS from './css';
import RES from './res';

export default React.createClass(Radium.wrap({

  /**
   * @private
   */
  cancelEvent(event) {
    log('cancelEvent');
    event.preventDefault();
  },

  /**
   * @private
   */
  dropFiles(event) {
    log('dropFiles');
    DropAreaAction.dropFiles(event);
  },

  /**
   * @private
   */
  uploadFiles(event) {
    log('uploadFiles');
    DropAreaAction.uploadFiles(event);
  },

  //------------------------------------------------------------------------------

  displayName: 'DropArea',

  render() {
    return (
      <section
        onDrop={this.dropFiles}
        onDragOver={this.cancelEvent}
        onDragLeave={this.cancelEvent}
        onDragEnd={this.cancelEvent}>
        <div style={CSS.div}>
          <p style={[CSS.p, CSS.drop]}>ここに画像をドロップ</p>
          <p style={[CSS.p, CSS.extensions]}>gif, jpg, png, svg</p>
          <img style={CSS.img} src={RES.image.background} alt="" />
          <p style={[CSS.p, CSS.or]}>または</p>
          <button
            style={CSS.button}
            type="button"
            onClick={this.uploadFiles}>参照してアップロード</button>
        </div>
      </section>
    );
  },

}))
