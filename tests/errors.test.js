const nock = require('nock');
const { doLookup, startup } = require('../integration');

const options = {
  url: 'https://hexjcp623-hx-webui-1.hex01.helix.apps.fireeye.com',
  apiToken: 'token',
  maxConcurrent: 20,
  minTime: 1
};

const hash = {
  type: 'hash',
  value: '678668491661fd1b694817cfaf75dde4',
  isMD5: true
};

const Logger = {
  trace: (args, msg) => {
    console.info(msg, args);
  },
  info: (args, msg) => {
    console.info(msg, args);
  },
  error: (args, msg) => {
    console.info(msg, args);
  },
  debug: (args, msg) => {
    console.info(msg, args);
  },
  warn: (args, msg) => {
    console.info(msg, args);
  }
};

beforeAll(() => {
  startup(Logger);
});

[502, 504].forEach((statusCode) => {
  test(`${statusCode} response when calling the Trellix HX API should return a retryable response`, (done) => {
    const params = new URLSearchParams({
      md5values: '678668491661fd1b694817cfaf75dde4'
    });

    const scope = nock(options.url)
      .get(/.*/)
      .query(params)
      .reply(statusCode);

    doLookup([hash], options, (err, lookupResults) => {
      const details = lookupResults[0].data.details;
      console.log(details);
      expect(details.errorMessage).toBe(
        'A temporary Trellix HX API search limit was reached. You can retry your search by pressing the "Retry Search" button.'
      );
      expect(details.summaryTag).toBe('Lookup limit reached');
      done();
    });
  });
});

test('ECONNRESET  response when calling the Trellix HX API should return a retryable response', (done) => {
  const params = new URLSearchParams({
    md5values: '678668491661fd1b694817cfaf75dde4'
  });

  const scope = nock(options.url)
    .get(/.*/)
    .query(params)
    .replyWithError({ code: 'ECONNRESET' });

  doLookup([hash], options, (err, lookupResults) => {
    const details = lookupResults[0].data.details;
    expect(details.errorMessage).toBe(
      'A temporary Trellix HX API search limit was reached. You can retry your search by pressing the "Retry Search" button.'
    );
    expect(details.summaryTag).toBe('Lookup limit reached');
    done();
  });
});
