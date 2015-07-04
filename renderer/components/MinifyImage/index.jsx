import React from 'react';

import DropArea from '../DropArea';
import Throbber from '../Throbber';
import MinifyImageAction from '../../actions/MinifyImageAction';
import InitializeStore from '../../stores/InitializeStore';
import OptimizeImageStore from '../../stores/OptimizeImageStore';

import CSS from './css.scss';

export default class MinifyImage extends React.Component {

  state = {
    isProcessing: false,
  };

  beginProcess = () => {
    // show throbber
    this.setState({ isProcessing: true });
  };

  endProcess = () => {
    // hide throbber
    this.setState({ isProcessing: false });
  };

  renderThrobber = () => {
    if (this.state.isProcessing) {
      return (<Throbber/>);
    }
  };

  //----------------------------------------------------------------------------

  componentDidMount() {
    InitializeStore.addInitializingListener(this.beginProcess);
    InitializeStore.addInitializedListener(this.endProcess);

    OptimizeImageStore.addProcessingListener(this.beginProcess);
    OptimizeImageStore.addFinishListener(this.endProcess);

    // trigger initialize
    MinifyImageAction.initialize();
  }

  componentWillUnmount() {
    InitializeStore.removeInitializingListener(this.beginProcess);
    InitializeStore.removeInitializedListener(this.endProcess);

    OptimizeImageStore.removeProcessingListener(this.beginProcess);
    OptimizeImageStore.removeFinishListener(this.endProcess);
  }

  render() {
    return (
      <section className={CSS.section}>
        <DropArea/> {this.renderThrobber()}
      </section>
    );
  }

}
