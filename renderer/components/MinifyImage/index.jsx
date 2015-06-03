let React = require('react'),
    Radium = require('radium');

let DropArea = require('../DropArea'),
    Throbber = require('../Throbber'),
    MinifyImageAction = require('../../actions/MinifyImageAction'),
    InitializeStore = require('../../stores/InitializeStore'),
    OptimizeImageStore = require('../../stores/OptimizeImageStore');

let CSS = require('./css');

let MinifyImage = React.createClass(Radium.wrap({

  beginProcess() {
    // show throbber
    this.setState({ isProcessing: true });
  },

  endProcess() {
    // hide throbber
    this.setState({ isProcessing: false });
  },

  //----------------------------------------------------------------------------

  displayName: 'MinifyImage',

  componentDidMount() {
    InitializeStore.addInitializingListener(this.beginProcess);
    InitializeStore.addInitializedListener(this.endProcess);

    OptimizeImageStore.addProcessingListener(this.beginProcess);
    OptimizeImageStore.addFinishListener(this.endProcess);

    // trigger initialize
    MinifyImageAction.initialize();
  },

  componentWillUnmount() {
    InitializeStore.removeInitializingListener(this.beginProcess);
    InitializeStore.removeInitializedListener(this.endProcess);

    OptimizeImageStore.removeProcessingListener(this.beginProcess);
    OptimizeImageStore.removeFinishListener(this.endProcess);
  },

  getInitialState() {
    return {
      isProcessing: false,
    };
  },

  render() {
    return (
      <section style={CSS.section}>
        <DropArea/>
        {
          this.state.isProcessing && <Throbber/>
        }
      </section>
    );
  },

}));

module.exports = MinifyImage;
