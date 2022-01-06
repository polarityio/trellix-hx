const fs = require("fs");
const request = require("postman-request");
const config = require("../config/config");

const _configFieldIsValid = (field) =>
  typeof field === "string" && field.length > 0;

let Logger;
let requestWithDefaults;

const setRequestDefaults = (Logger) => {
  const {
    request: { ca, cert, key, passphrase, rejectUnauthorized, proxy },
  } = config;

  const defaults = {
    ...(_configFieldIsValid(ca) && { ca: fs.readFileSync(ca) }),
    ...(_configFieldIsValid(cert) && { cert: fs.readFileSync(cert) }),
    ...(_configFieldIsValid(key) && { key: fs.readFileSync(key) }),
    ...(_configFieldIsValid(passphrase) && { passphrase }),
    ...(_configFieldIsValid(proxy) && { proxy }),
    ...(typeof rejectUnauthorized === "boolean" && { rejectUnauthorized }),
  };

  const _defaultsRequest = request.defaults(defaults);

  requestWithDefaults = (requestOptions) =>
    new Promise((resolve, reject) => {
      _defaultsRequest(requestOptions, (err, res, body) => {
        if (err) return reject(err);
        const response = { ...res, body };

        try {
          checkForStatusError(response, requestOptions);
        } catch (err) {
          reject(err);
        }

        resolve(response);
      });
    });

  return requestWithDefaults;
};

const checkForStatusError = (response, requestOptions) => {
  const statusCode = response.statusCode;

  if (![200, 429, 500, 502, 504].includes(statusCode)) {
    
    const requestError = Error("Request Error");
    requestError.status = statusCode;
    requestError.description = JSON.stringify(response.body);
    requestError.requestOptions = requestOptions;
    throw requestError;
  }
};

module.exports = setRequestDefaults;
