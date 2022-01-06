'use strict';

polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  alerts: Ember.computed.alias('block.data.details.alerts.entries'),
  hostWithAlert: Ember.computed.alias('block.data.details.hostsWithAlerts'),
  policies: Ember.computed.alias('block.data.details.policies.entries'),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  expandableTitleStates: {},
  activeTab: 'alerts',
  actions: {
    changeTab: function (tabName) {
      this.set('activeTab', tabName);
    },
    retryLookup: function () {
      this.set('running', true);
      this.set('errorMessage', '');

      const payload = {
        action: 'RETRY_LOOKUP',
        entity: this.get('block.entity')
      };

      this.sendIntegrationMessage(payload)
        .then((result) => {
          if (result.data.summary) this.set('summary', result.summary);
          this.set('block.data', result.data);
        })
        .catch((err) => {
          this.set('details.errorMessage', JSON.stringify(err, null, 4));
        })
        .finally(() => {
          this.set('running', false);
        });
    },
    toggleExpandableTitle: function (index) {
      const modifiedExpandableTitleStates = Object.assign(
        {},
        this.get('expandableTitleStates'),
        {
          [index]: !this.get('expandableTitleStates')[index]
        }
      );

      this.set(`expandableTitleStates`, modifiedExpandableTitleStates);
    },
    showPolicyInfo: function (policyName, index) {
      const policy = this.get(`block.data.details.policies.entries.${index}`);

      const showPolicyInfo = this.get(
        `block.data.details.policies.entries.${index}.${policyName}`
      );

      Ember.set(policy, policyName, !showPolicyInfo);
      this.get('block').notifyPropertyChange('data');
    }
  }
});
