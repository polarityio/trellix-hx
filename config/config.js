module.exports = {
  name: 'Trellix HX',
  acronym: 'THX',
  description:
    "Polarity's Trellix HX integration allows querying for Alerts, Associated Hosts, and Policy data using Hashes.",
  entityTypes: ['MD5', 'SHA1', 'SHA256'],
  defaultColor: 'light-purple',
  styles: ['./styles/styles.less'],
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ''
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'url',
      name: 'Trellix HX Instance URL',
      description:
        'The URL of the Trellix HX instance you would like to connect to (including http:// or https://)',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'apiToken',
      name: 'Trellix HX API Token',
      description: 'The API Token associated with the Trellix HX account.',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'maxConcurrent',
      name: 'Max Concurrent Requests',
      description:
        'Maximum number of concurrent requests.  Integration must be restarted after changing this option. Defaults to 20.',
      default: 20,
      type: 'number',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'minTime',
      name: 'Minimum Time Between Lookups',
      description:
        'Minimum amount of time in milliseconds between lookups. Integration must be restarted after changing this option. Defaults to 100.',
      default: 100,
      type: 'number',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
