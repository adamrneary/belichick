import React, { PropTypes } from 'react';
import Rcslider from 'rc-slider';


class Variable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variable: props.targetAllocation,
      pending: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      variable: nextProps.targetAllocation,
      pending: !!nextProps.targetAllocationPending,
    });
  }

  render() {
    const numberStyle = {
      fontSize: 150,
      fontWeight: 100,
      color: this.state.pending ? '#268bd2' : 'white',
    };
    return (
      <div className="Variable">
        <div style={numberStyle}>
          {this.state.variable}
        </div>
        <div>Target Allocations</div>
        <div style={{ width: '80%', marginTop: 20 }}>
          <Rcslider
            tipFormatter={null}
            max={1}
            value={this.state.variable}
            step={0.1}
            onChange={(variable) => {
              this.setState({
                variable,
                pending: true,
              });
            }}
            onAfterChange={this.props.updateAllocation}
          />
        </div>
      </div>
    );
  }
}
Variable.propTypes = {
  targetAllocation: PropTypes.number,
  targetAllocationPending: PropTypes.bool,
  updateAllocation: PropTypes.func,
};

export default Variable;
