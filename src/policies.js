const getPolicies = async (requestWithDefaults, options, Logger) => {
  try {
    
    const policies = await requestWithDefaults({
      method: "GET",
      url: `${options.url}/hx/api/v3/policies`,
      headers: {
        Authorization: "Basic " + options.apiToken,
      },
      json: true,
    });

    Logger.trace({ policies }, "Policy Data");
    return policies.body.data;
  } catch (err) {
    Logger.trace({ err }, "Error getting policies");
    throw err;
  }
};

module.exports = { getPolicies };
