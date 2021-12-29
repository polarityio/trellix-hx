"use strict";
const _ = require("lodash");
const Bottleneck = require("bottleneck/es5");

const setRequestDefaults = require("./src/buildRequest");
const buildResponse = require("./src/buildResponse");

let limiter = null;
let Logger;
let requestWithDefaults;

const startup = (logger) => {
  Logger = logger;
  requestWithDefaults = setRequestDefaults(Logger);
};

const _setupLimiter = (options) => {
  limiter = new Bottleneck({
    maxConcurrent: Number.parseInt(options.maxConcurrent, 10), // no more than 5 lookups can be running at single time
    highWater: 100, // no more than 100 lookups can be queued up
    strategy: Bottleneck.strategy.OVERFLOW,
    minTime: Number.parseInt(options.minTime, 10), // don't run lookups faster than 1 every 200 ms
  });
};

const doLookup = async (entities, options, callback) => {
  let lookupResults;
  if (!limiter) _setupLimiter(options);

  try {
    for (const entity of entities) {
      lookupResults = await limiter.schedule(() =>
        buildResponse(entity, requestWithDefaults, options, Logger)
      );

      Logger.trace({ lookupResults }, "Lookup Results");
      return callback(null, lookupResults);
    }
  } catch (err) {
    Logger.trace({ err }, "Lookup Error");
    return callback(err);
  }
};

const onMessage = (payload, options, callback) => {
  switch (payload.action) {
    case "RETRY_LOOKUP":
      doLookup([payload.entity], options, (err, lookupResults) => {
        if (err) {
          Logger.error({ err }, "Error retrying lookup");
          callback(err);
        } else {
          callback(
            null,
            lookupResults && lookupResults[0] && lookupResults[0].data === null
              ? { data: { summary: ["No Results Found on Retry"] } }
              : lookupResults[0]
          );
        }
      });
      break;
  }
};

const validateOption = (errors, options, optionName, errMessage) => {
  if (
    !(
      typeof options[optionName].value === "string" && options[optionName].value
    )
  ) {
    errors.push({
      key: optionName,
      message: errMessage,
    });
  }
};

const validateOptions = (options, callback) => {
  let errors = [];

  validateOption(errors, options, "url", "You must provide an api url.");
  validateOption(
    errors,
    options,
    "apiToken",
    "You must provide a valid access key."
  );

  if (options.maxConcurrent.value < 1) {
    errors = errors.concat({
      key: "maxConcurrent",
      message: "Max Concurrent Requests must be 1 or higher",
    });
  }

  if (options.minTime.value < 1) {
    errors = errors.concat({
      key: "minTime",
      message: "Minimum Time Between Lookups must be 1 or higher",
    });
  }
  callback(null, errors);
};

module.exports = {
  startup,
  doLookup,
  onMessage,
  validateOptions,
};

