import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import { LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend } from 'recharts';

import bank from 'services/bank';

class BankAmountChart extends Component {
  static propTypes = {};

  render() {
    const results = bank({
      tmobile: this.props.tmobile,
      initial: this.props.initial,
      firstDay: this.props.firstDay,
    });

    const monthStartTimestamp = moment(results.nextMonth).subtract(1, 'month').valueOf();

    const data = [
      {
        name: 'Month start',
        date: 0,
        actual: this.props.initial,
        expected: this.props.initial,
        desired: this.props.initial,
        perDay: results.perDayExpected,
      },
      {
        name: 'Today',
        date: results.now.valueOf() - monthStartTimestamp,
        actual: this.props.tmobile,
        desired: this.props.tmobile,
        expected: results.expected,
        perDay: results.perDay,
      },
      {
        name: 'Next month',
        date: results.nextMonth.valueOf() - monthStartTimestamp,
        actual: 0 - (results.deficit / results.daysPassed) * results.totalDays,
        desired: 0,
        expected: 0,
        perDay: results.perDay,
      },
    ];

    return (
      <div>
        <LineChart
          width={600}
          height={500}
          data={data}
          margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="date" type="number"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
          <ReferenceLine x="Today" stroke="red" label="Today"/>
          <ReferenceLine y={0} label="" stroke="red"/>
          <Line type="monotone" dataKey="actual" stroke="#8884d8" />
          <Line type="monotone" dataKey="expected" stroke="#82ca9d" />
          <Line type="monotone" dataKey="desired" stroke="#ca8282" />
        </LineChart>
      </div>
    );
  }
}

export default connect(
  state => ({}),
  {}
)(BankAmountChart);
