"use strict";

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
    showAgentLogging: function (index) {
      const policy = this.get('block.data.details.policies.entries.' + index);

      const __showAgentLogging = this.get(
        'block.data.details.policies.entries.' + index + '.__showAgentLogging'
      );

      if (__showAgentLogging) {
        Ember.set(policy, '__showAgentLogging', false);
      } else {
        Ember.set(policy, '__showAgentLogging', true);
      }
    },
    showProxyInformation: function (index) {
      const policy = this.get('block.data.details.policies.entries.' + index);

      const __showProxyInformation = this.get(
        'block.data.details.policies.entries.' + index + '.__showProxyInformation'
      );

      if (__showProxyInformation) {
        Ember.set(policy, '__showProxyInformation', false);
      } else {
        Ember.set(policy, '__showProxyInformation', true);
      }
    },
    showResourceUse: function (index) {
      const policy = this.get('block.data.details.policies.entries.' + index);

      const __showResourceUse = this.get(
        'block.data.details.policies.entries.' + index + '.__showResourceUse'
      );

      if (__showResourceUse) {
        Ember.set(policy, '__showResourceUse', false);
      } else {
        Ember.set(policy, '__showResourceUse', true);
      }
    },
    showMalwareScans: function (index) {
      const policy = this.get('block.data.details.policies.entries.' + index);

      const __showMalwareScans = this.get(
        'block.data.details.policies.entries.' + index + '.__showMalwareScans'
      );

      if (__showMalwareScans) {
        Ember.set(policy, '__showMalwareScans', false);
      } else {
        Ember.set(policy, '__showMalwareScans', true);
      }
    },
    showServerAddress: function (index) {
      const policy = this.get('block.data.details.policies.entries.' + index);

      const __showServerAddress = this.get(
        'block.data.details.policies.entries.' + index + '.__showServerAddress'
      );

      if (__showServerAddress) {
        Ember.set(policy, '__showServerAddress', false);
      } else {
        Ember.set(policy, '__showServerAddress', true);
      }
    },
    showTamperInformation: function (index) {
      const policy = this.get('block.data.details.policies.entries.' + index);

      const __showTamperInformation = this.get(
        'block.data.details.policy.entries.' + index + '.__showTamperInformation'
      );

      if (__showTamperInformation) {
        Ember.set(policy, '__showTamperInformation', false);
      } else {
        Ember.set(policy, '__showTamperInformation', true);
      }
    }
  }
});

