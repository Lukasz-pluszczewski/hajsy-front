import _ from 'lodash';

const is = params => {
  if (Array.isArray(params)) {
    return !_.some(params, _.isNil);
  }
  return !_.isNil(params);
};

const getPitFromNet = (net, pitRate) => pitRate ? ((net * pitRate) / (1 - pitRate)) : 0;
const getVatFromNet = (net, vatRate, pit = 0) => (net + pit) * vatRate;

const priceHelper = ({ gross, net, pitRate, vatRate, pit, vat }) => {
  console.log('price', { gross, net, pitRate, vatRate, pit, vat });
  if (is([gross, pitRate, vatRate])) {
    console.log('Values calculated from gross, pitRate and vatRate');
    let net;
    let pit;
    let vat;
    if (pitRate) {
      net = (gross - gross * pitRate) / (vatRate + 1);
      pit = getPitFromNet(net, pitRate);
      vat = getVatFromNet(net, vatRate, pit);
    } else {
      net = gross / (1 + vatRate);
      pit = 0;
      vat = getVatFromNet(net, vatRate, pit);
    }

    return {
      gross,
      net,
      pit,
      vat,
      pitRate,
      vatRate,
    };
  }
  if (is([net, pitRate, vatRate])) {
    console.log('Values calculated from net, pitRate and vatRate');
    let gross;
    let pit;
    let vat;
    if (pitRate) {
      gross = (net * (vatRate + 1)) / (1 - pitRate);
      pit = getPitFromNet(net, pitRate);
      vat = getVatFromNet(net, vatRate, pit);
    } else {
      gross = net * (1 + vatRate);
      pit = 0;
      vat = getVatFromNet(net, vatRate, pit);
    }

    return {
      gross,
      net,
      pit,
      vat,
      pitRate,
      vatRate,
    };
  }
  if (is([vat, vatRate, pitRate])) {
    console.log('Values calculated from vat, pitRate and vatRate');
    if (vatRate === 0) {
      return new Error('Division by zero. Vat must have rate other that 0 to calculate values');
    }
    let net;
    let gross;
    if (pitRate) {
      net = (vat - pitRate * vat) / vatRate;
      gross = (net * (vatRate + 1)) / (1 - pitRate);
      pit = getPitFromNet(net, pitRate);
    } else {
      net = vat / vatRate;
      gross = net * (1 + vatRate);
      pit = 0;
    }

    return {
      gross,
      net,
      pit,
      vat,
      pitRate,
      vatRate,
    };
  }
  if (is([pit, vatRate, pitRate])) {
    console.log('Values calculated from pit, pitRate and vatRate');
    if (pitRate === 0) {
      return new Error('Division by zero. Pit must have rate other that 0 to calculate values');
    }
    const net = pit * (1 / pitRate - 1);
    const gross = (net * (vatRate + 1)) / (1 - pitRate);
    vat = getVatFromNet(net, vatRate, pit);

    return {
      gross,
      net,
      pit,
      vat,
      pitRate,
      vatRate,
    };
  }
  if (is([gross, net, pitRate])) {
    console.log('Values calculated from gross, net and pitRate');
    let vatRate;
    if (pitRate) {
      vatRate = (gross * (-pitRate) + gross - net) / net;
    } else {
      vatRate = 1 - (net / gross);
    }
    const pit = getPitFromNet(net, pitRate);
    const vat = getVatFromNet(net, vatRate, pit);

    return {
      gross,
      net,
      pit,
      vat,
      pitRate,
      vatRate,
    };
  }

  if (is([gross, net, vatRate])) {
    console.log('Values calculated from gross, net and vatRate');
    const pitRate = 1 - (net * (vatRate + 1)) / gross;
    const pit = getPitFromNet(net, pitRate);
    const vat = getVatFromNet(net, vatRate, pit);

    return {
      gross,
      net,
      pit,
      vat,
      pitRate,
      vatRate,
    };
  }
};

const roundValues = values => _.mapValues(values, value => _.round(value, 2));

/**
 * Gets data about the price
 * @param {number} value
 * @param {number} vat from 0 to 1
 * @param {number} pit from 0 to 1
 * @param {string} source - possible values: `gross`, `vat`, `pit`, `withVat`, `withPit`, `net`
 * @param {boolean} alwaysAddPit should pit be added even to 'net', 'vat', 'withVat' values
 */
const price = (value, { vatRate = 0.23, pitRate = 0.18, source = 'gross' } = {}) => {
  switch (source) {
    case 'gross':
      return priceHelper({ gross: value, pitRate, vatRate });
    case 'vat':
      return priceHelper({ vat: value, pitRate, vatRate });
    case 'pit':
      return priceHelper({ pit: value, pitRate, vatRate });
    case 'net':
      return priceHelper({ net: value, pitRate, vatRate });
    case 'withVat': {
      throw new Error('this is WRONG!!!!');
      return priceHelper({ gross: value * (1 + pitRate), pitRate, vatRate });
    }
    case 'withPit': {
      const results = priceHelper({ gross: value, pitRate, vatRate: 0 });
      return priceHelper({ net: results.net, pitRate, vatRate });
    }
    default:
      throw new Error('wrong `source` param value. Must be one of: `gross`, `vat`, `pit`, `withVat`, `withPit`, `net`');
  }
};

const priceRounded = (...params) => roundValues(price(...params));

export default priceRounded;
