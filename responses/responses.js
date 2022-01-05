const _ = require('lodash');

const polarityError = (err) => {
  const errorMsg = err.message;
  return {
    detail: errorMsg ? errorMsg : 'Unknown Error',
    error: err
  };
};

const emptyResponse = (entity) => [
  {
    entity,
    data: null
  }
];

const polarityResponse = (entity, response, Logger) => {
  const results = _.get(response, 'alerts.entries');
  return _.get(response, 'alerts.entries').length
    ? {
        entity,
        data: results ? { summary: getSummary(response), details: response } : null
      }
    : emptyResponse(entity);
};

const retryablePolarityResponse = (entity) => {
  return {
    entity,
    isVolatile: true,
    data: {
      summary: ['Lookup limit reached'],
      details: {
        summaryTag: 'Lookup limit reached',
        errorMessage:
          'A temporary FireEye HX API search limit was reached. You can retry your search by pressing the "Retry Search" button.'
      }
    }
  };
};

const getSummary = (response) => {
  let tags = [];
  tags.push(`Alerts: ${response.alerts.entries.length}`);

  for (const alert of response.alerts.entries) {
    tags.push(`IOC: ${alert.indicator.name}`);
  }

  return tags;
};

module.exports = {
  polarityError,
  emptyResponse,
  polarityResponse,
  retryablePolarityResponse
};
