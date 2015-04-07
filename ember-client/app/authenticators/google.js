import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import request from 'ic-ajax';
import authUtils from 'ember-client/authenticators/utils.js'
import config from '../config/environment';

/**
 * Performs a Google login using the Google API. Google returns an access token which we need to send to the
 * server so that the server can retrieve the user's information from Google.
 */
export default Base.extend({
  restore: function (properties) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (!Ember.isEmpty(properties.accessToken)) {
        resolve(properties);
      }
      else {
        reject();
      }
    });
  },
  authenticate: function (options) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      gapi.auth.authorize({
        client_id: config.APP.Google_ClientId,
        scope: ['https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/userinfo.email'],
        'approvalprompt': 'force',
        immediate: false,
        response_type: 'code'
      }, function (authResult) {
        if (authResult && !authResult.error) {
          authUtils.resolveCodeToToken('google', authResult.code, resolve, reject);
        }
        else {
          reject((authResult || {}).error);
        }
      });

    });
  }

  // TODO invalidate
});

