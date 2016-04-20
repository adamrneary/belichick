import React, { PropTypes } from 'react';
import { map, min } from 'lodash';
import numeral from 'numeral';

const Performance = ({ data }) => {
  const minCreateRate = min(map(data, row => row.todosCreated / row.users));
  const minCompleteRate = min(map(data, row => row.todosCompleted / row.todosCreated));
  return (
    <div className="Performance">
      <table>
        <thead>
          <tr>
            <td>Variant</td>
            <td>Users</td>
            <td>Todos Created</td>
            <td>Improvement</td>
            <td>Todos Completed</td>
            <td>Improvement</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {
            map(data, (row, key) => (
              <PerformanceRow
                key={key}
                row={row}
                minCreateRate={minCreateRate}
                minCompleteRate={minCompleteRate}
              />
            ))
          }
        </tbody>
      </table>
    </div>
  );
};
Performance.propTypes = {
  data: PropTypes.object.isRequired,
};

const PerformanceRow = ({ row, minCreateRate, minCompleteRate }) => {
  const createImprovement = (row.todosCreated / row.users) / minCreateRate;
  const createImprovementStr = createImprovement === 1
    ? '–'
    : <span style={{ color: '#859900' }}>+{numeral(createImprovement).format('0.00%')}</span>;
  const completeImprovement = (row.todosCompleted / row.todosCreated) / minCompleteRate;
  const completeImprovementStr = completeImprovement === 1
    ? '–'
    : <span style={{ color: '#859900' }}>+{numeral(completeImprovement).format('0.00%')}</span>;
  const successStr = createImprovement === 1
    ? 'Rejected'
    : 'Winner';
  return (
    <tr>
      <td>{row.label}</td>
      <td>{numeral(row.users).format('0,0')}</td>
      <td>
        {numeral(row.todosCreated).format('0,0')}<br />
        {numeral(row.todosCreated / row.users).format('0.0')} todos / user
      </td>
      <td>{createImprovementStr}</td>
      <td>
        {numeral(row.todosCompleted).format('0,0')}<br />
        {numeral(row.todosCompleted / row.todosCreated * 100).format('0.0')}% completion rate
      </td>
      <td>{completeImprovementStr}</td>
      <td><div className={`Pill Pill-${successStr}`}>{successStr}</div></td>
    </tr>
  );
};
PerformanceRow.propTypes = {
  row: PropTypes.object.isRequired,
  minCreateRate: PropTypes.number.isRequired,
  minCompleteRate: PropTypes.number.isRequired,
};

export default Performance;
