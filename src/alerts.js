const _ = require("lodash");

const getAlerts = async (entity, requestWithDefaults, options, Logger) => {
  try {
    const alerts = await requestWithDefaults({
      method: "GET",
      url: `${options.url}/hx/api/v3/alerts?md5values=${entity.value}`,
      headers: {
        Authorization: "Basic " + options.apiToken,
      },
      json: true,
    });

    Logger.trace({ alerts }, "Alerts Response");
    return alerts;
  } catch (err) {
    Logger.error({ err }, "Alerts Error");
    throw err;
  }
};

const getHostWithAlerts = async (
  alerts,
  requestWithDefaults,
  options,
  Logger
) => {
  const { entries } = alerts.body.data;

  try {
    const hostWithAlertsResults = await Promise.all(
      entries.map(async (alert) => {
        const response = await requestWithDefaults({
          method: "GET",
          url: `${options.url}${alert.agent.url}`,
          headers: {
            Authorization: "Basic " + options.apiToken,
          },
          json: true,
        });
        return response.body.data;
      })
    );

    Logger.trace({ hostWithAlertsResults }, "Host With Alerts Results");
    return hostWithAlertsResults;
  } catch (err) {
    Logger.error({ err }, "Hosts With Alerts Error");
    throw err;
  }
};

module.exports = {
  getAlerts,
  getHostWithAlerts,
};
