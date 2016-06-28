'use strict'

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['NBA Conf. Registration App'],
  /**
   * Your New Relic license key.
   */
  license_key: 'eaeffe3b7251f14e6ef490539ccea1bc05df81db',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  },
  error_collector: {
    ignore_status_codes: [ 404, 400, 401, 402, 403, 409 ]
  }
};
