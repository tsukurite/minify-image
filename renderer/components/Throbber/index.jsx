let React = require('react'),
    Radium = require('radium');

let CSS = require('./css'),
    RES = require('./res');

let Throbber = React.createClass(Radium.wrap({

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

}));

module.exports = Throbber;
