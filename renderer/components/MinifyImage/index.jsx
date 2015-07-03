import React from 'react';
import Radium from 'radium';

import DropArea from '../DropArea';
import Throbber from '../Throbber';
import MinifyImageAction from '../../actions/MinifyImageAction';
import InitializeStore from '../../stores/InitializeStore';
import OptimizeImageStore from '../../stores/OptimizeImageStore';

import CSS from './css';

export default React.createClass(Radium.wrap({

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

}))
