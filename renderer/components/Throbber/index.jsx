import React from 'react';

import CSS from './css.scss';
import RES from './res';

export default class Throbber extends React.Component {

  render() {
    return (
      <section className={CSS.section}>
        <div>
          <img src={RES.image.throbber} alt=""/>
        </div>
      </section>
    );
  }

}
