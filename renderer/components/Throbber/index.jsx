import React from 'react';
import Radium from 'radium';

import CSS from './css';
import RES from './res';

export default React.createClass(Radium.wrap({

  displayName: 'Throbber',

  render() {
    return (
      <section>
        <div style={CSS.div}>
          <img style={CSS.img} src={RES.image.throbber} alt=""/>
        </div>
      </section>
    );
  },

}))
