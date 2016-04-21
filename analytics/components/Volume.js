import React, { PropTypes } from 'react';
import d3 from 'd3';

const n = 2; // number of layers
const m = 60; // number of samples per layer

class Volume extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stacked: true,
    };
    this.transitionStacked = this.transitionStacked.bind(this);
    this.transitionGrouped = this.transitionGrouped.bind(this);
  }

  componentDidMount() {
    this.stack = d3.layout.stack();
    this.layers = this.stack(this.props.data);
    this.yGroupMax = d3.max(this.layers, layer => d3.max(layer, d => d.y));
    this.yStackMax = d3.max(this.layers, layer => d3.max(layer, d => d.y0 + d.y));

    this.margin = { top: 40, right: 10, bottom: 20, left: 10 };
    this.width = this.volumeChart.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.volumeChart.offsetHeight - this.margin.top - this.margin.bottom;

    this.x = d3.scale.ordinal()
        .domain(d3.range(m))
        .rangeRoundBands([0, this.width], 0.08);

    this.y = d3.scale.linear()
        .domain([0, this.yStackMax])
        .range([this.height, 0]);

    this.color = d3.scale.linear()
        .domain([0, n - 1])
        .range(['#aad', '#556']);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .tickSize(0)
        .tickPadding(6)
        .orient('bottom');

    this.svg = d3.select('#VolumeChart').append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.layer = this.svg.selectAll('.layer')
        .data(this.layers)
      .enter().append('g')
        .attr('class', 'layer')
        .style('fill', (d, i) => this.color(i));

    this.rect = this.layer.selectAll('rect')
        .data(d => d)
      .enter().append('rect')
        .attr('x', d => this.x(d.x))
        .attr('y', this.height)
        .attr('width', this.x.rangeBand())
        .attr('height', 0);

    this.rect.transition()
        .delay((d, i) => i * 10)
        .attr('y', d => this.y(d.y0 + d.y))
        .attr('height', d => this.y(d.y0) - this.y(d.y0 + d.y));

    this.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${this.height})`)
        .call(this.xAxis);

    this.timeout = setTimeout(() => { this.formHandler(false); }, 2000);
  }

  transitionStacked() {
    this.y.domain([0, this.yStackMax]);

    this.rect.transition()
        .duration(500)
        .delay((d, i) => i * 10)
        .attr('y', (d) => this.y(d.y0 + d.y))
        .attr('height', d => this.y(d.y0) - this.y(d.y0 + d.y))
      .transition()
        .attr('x', d => this.x(d.x))
        .attr('width', this.x.rangeBand());
  }

  transitionGrouped() {
    this.y.domain([0, this.yGroupMax]);

    this.rect.transition()
        .duration(500)
        .delay((d, i) => i * 10)
        .attr('x', (d, i, j) => this.x(d.x) + this.x.rangeBand() / n * j)
        .attr('width', this.x.rangeBand() / n)
      .transition()
        .attr('y', d => this.y(d.y))
        .attr('height', d => this.height - this.y(d.y));
  }

  formHandler(stacked) {
    clearTimeout(this.timeout);
    this.setState({ stacked });
    if (stacked) {
      this.transitionStacked();
    } else {
      this.transitionGrouped();
    }
  }

  render() {
    /*eslint-disable*/
    const refAssignment = (ref) => this.volumeChart = ref;
    /*eslint-enable*/
    return (
      <div className="Volume">
        <div style={{ position: 'absolute' }}>Trailing 60 minute allocations</div>
        <form>
          <label>
            <input
              type="radio"
              name="mode"
              onChange={() => {this.formHandler(false); }}
              checked={!this.state.stacked}
            />
            Grouped
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              onChange={() => {this.formHandler(true); }}
              checked={this.state.stacked}
            />
            Stacked
          </label>
        </form>
        <div id="VolumeChart" style={{ width: '100%' }} ref={refAssignment}></div>
        <p>
          D3 data visualization example cribbed liberally from <a href="https://bl.ocks.org/mbostock/3943967">https://bl.ocks.org/mbostock/3943967</a>
        </p>
      </div>
    );
  }
}
Volume.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Volume;
