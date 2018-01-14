import React, { Component } from 'react';
import { connect } from 'react-redux';

import price from 'services/price';
import bank from 'services/bank';

import Layout from 'containers/Layout';
import Input from 'components/Input';
import Select from 'components/Select';
import BankAmountChart from 'components/BankAmountChart';
import PitVatChart from 'components/PitVatChart';

import 'styles/pages/HomePage.scss';

class HomePage extends Component {
  static propTypes = {
  };
  constructor(props) {
    super(props);
    const previousState = localStorage.getItem('hajsy');

    this.state = previousState
      ? JSON.parse(previousState)
      : {
        tmobile: 0,
        ing: 0,
        idea: 0,
        initial: 3000,
        firstDay: 10,

        type: 'gross',
        grossPrice: 1000,
        vat: 23,
        pit: 18,
      };
    window.price = price;
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('hajsy', JSON.stringify(nextState));
  }

  onTmobileChange = e => this.setState({ tmobile: parseInt(e.target.value) });
  onIngChange = e => this.setState({ ing: parseInt(e.target.value) });
  onIdeaChange = e => this.setState({ idea: parseInt(e.target.value) });
  onInitialChange = e => this.setState({ initial: parseInt(e.target.value) });
  onFirstDayChange = e => this.setState({ firstDay: parseInt(e.target.value) });

  onTypeChange = e => this.setState({ type: e.target.value });
  onGrossValueChange = e => this.setState({ grossPrice: parseInt(e.target.value) });
  onVatChange = e => this.setState({ vat: parseInt(e.target.value) });
  onPitChange = e => this.setState({ pit: parseInt(e.target.value) });

  render() {
    const priceSettings = {
      vatRate: (this.state.vat || 0) / 100,
      pitRate: (this.state.pit || 0) / 100,
      source: this.state.type,
    };

    const priceDetails = price(this.state.grossPrice, priceSettings);
    const result = {
      ...priceDetails,
      withVat: priceDetails.net + priceDetails.vat,
      withPit: priceDetails.net + priceDetails.pit,
    };

    return (
      <Layout>
        <div className="HomePage">
          <div className="HomePage__header">
            <h1>Hajsy</h1>
          </div>
          <div>
            <Input value={this.state.tmobile} onChange={this.onTmobileChange} label="T-mobile" type="number" />
            <Input value={this.state.ing} onChange={this.onIngChange} label="Ing" type="number" />
            <Input value={this.state.idea} onChange={this.onIdeaChange} label="Idea" type="number" />
            <Input value={this.state.initial} onChange={this.onInitialChange} label="Initial amount" type="number" />
            <Input value={this.state.firstDay} onChange={this.onFirstDayChange} label="First day" type="number" />
            <BankAmountChart
              tmobile={this.state.tmobile}
              initial={this.state.initial}
              firstDay={this.state.firstDay}
            />
            <pre>
              {JSON.stringify(bank({
                tmobile: this.state.tmobile,
                initial: this.state.initial,
                firstDay: this.state.firstDay,
              }), null, 2)}
            </pre>
          </div>
          <hr/>
          <div>
            <Select
              value={this.state.type}
              options={[
                { value: 'gross', text: 'gross' },
                { value: 'net', text: 'net' },
                { value: 'pit', text: 'pit' },
                // { value: 'withVat', text: 'withVat' },
                { value: 'withPit', text: 'withPit' },
              ]}
              onChange={this.onTypeChange}
              label="Value type"
            />
            <Input value={this.state.vat} onChange={this.onVatChange} label="VAT" type="number" />
            <Input value={this.state.pit} onChange={this.onPitChange} label="PIT" type="number" />
            <Input value={this.state.grossPrice} onChange={this.onGrossValueChange} label="Value" type="number" />
            <PitVatChart
              pit={result.pit}
              vat={result.vat}
              net={result.net}
            />
            <pre>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      </Layout>
    );
  }
}

export default connect(
  state => ({}),
  {}
)(HomePage);
