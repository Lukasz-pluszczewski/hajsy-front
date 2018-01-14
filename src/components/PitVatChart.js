import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import { PieChart, Pie, Legend, Tooltip } from 'recharts';

import bank from 'services/bank';

class BankAmountChart extends Component {
  static propTypes = {};

  render() {
    const data = [
      { name: 'pit', value: this.props.pit },
      { name: 'vat', value: this.props.vat },
      { name: 'net', value: this.props.net },
    ];

    return (
      <div>
        <PieChart width={800} height={400}>
          <Pie isAnimationActive={false} data={data} dataKey="value" cx={200} cy={200} outerRadius={80} fill="#8884d8" label/>
          <Tooltip/>
        </PieChart>
      </div>
    );
  }
}

export default connect(
  state => ({}),
  {}
)(BankAmountChart);
