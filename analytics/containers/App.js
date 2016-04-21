import Firebase from 'firebase';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ExperimentActions from '../actions';
import Variable from '../components/Variable';
import Volume from '../components/Volume';
import Performance from '../components/Performance';
import config from '../../config';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      nowShowing: 'all',
    };
  }

  componentWillMount() {
    this.firebaseRef = new Firebase(`${config.firebaseUrl}/experiments/colorScheme/`);
    this.firebaseRef.on('value', this.props.actions.onFirebaseValue);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  render() {
    const { actions, experiments } = this.props;
    if (!experiments.targetAllocation) {
      return <div></div>;
    }
    return (
      <div>
        <h1>Light vs Dark Experiment</h1>
        <div className="row">
          <Variable
            targetAllocation={experiments.targetAllocation}
            targetAllocationPending={experiments.targetAllocationPending}
            updateAllocation={actions.updateAllocation}
          />
          <Volume data={experiments.volumeData} />
        </div>
        <Performance data={experiments.performanceData} />
      </div>
    );
  }
}
App.propTypes = {
  experiments: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  experiments: state.experiments,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ExperimentActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
