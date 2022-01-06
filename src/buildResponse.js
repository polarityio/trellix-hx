const _ = require('lodash');
const { getAlerts, getHostWithAlerts } = require('./alerts');
const { getPolicies } = require('./policies');
const {
  polarityError,
  polarityResponse,
  retryablePolarityResponse
} = require('../responses/responses');

const getApiData = async (entity, requestWithDefaults, options, Logger) => {
  let hostsWithAlerts;
  let policies;

  try {
    const alerts = await getAlerts(entity, requestWithDefaults, options, Logger);
    const alertsData = _.get(alerts, 'body.data');

    // only make request for associated hosts and polices if an alert is found
    if (_.get(alerts, 'body.data') || _.get(alerts, 'body.data.entries')) {
      hostsWithAlerts = await getHostWithAlerts(
        alerts,
        requestWithDefaults,
        options,
        Logger
      );
      policies = await getPolicies(requestWithDefaults, options, Logger);
    }

    Logger.trace({ alertsData, hostsWithAlerts, policies }, 'API Responses');

    const apiData = {
      statusCode: alerts.statusCode,
      alerts: alertsData,
      hostsWithAlerts,
      policies
    };
    
    return apiData;
  } catch (err) {
    Logger.error({ err }, 'Error getting API data');
    throw err;
  }
};

const buildResponse = async (entity, requestWithDefaults, options, Logger) => {
  try {
    const apiData = await getApiData(entity, requestWithDefaults, options, Logger);

    Logger.trace({ apiData }, 'API RESULT');

    return apiData.statusCode === 200
      ? polarityResponse(entity, apiData, Logger)
      : retryablePolarityResponse(entity);
  } catch (err) {
    const isConnectionReset = _.get(err, 'code', '') === 'ECONNRESET';
    if (isConnectionReset) return retryablePolarityResponse(entity);
    else throw polarityError(err);
  }
};

module.exports = buildResponse;
