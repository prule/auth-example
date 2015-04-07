import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import request from 'ic-ajax';
import utils from 'ember-client/authenticators/utils.js'

/**
 * Performs a Facebook login using the Facebook API. Facebook returns an access token which we need to send to the
 * server so that the server can retrieve the user's information from Facebook.
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
      FB.getLoginStatus(function (fbResponse) {

        if (fbResponse.status === 'connected') {
          utils.resolveCodeToToken('facebook', fbResponse.authResponse.accessToken, resolve, reject);
        }
        else if (fbResponse.status === 'not_authorized') {
          reject();
        }
        else {
          FB.login(function (fbResponse) {
            if (fbResponse.authResponse) {
              utils.resolveCodeToToken('facebook', fbResponse.authResponse.accessToken, resolve, reject);
            }
            else {
              reject();
            }
          });
        }
      });
    });
  },

  invalidate: function (data) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      FB.getLoginStatus(function (response) {
        if (response && response.status === 'connected') {
          FB.logout(function (response) {
            Ember.run(resolve);
          });
        }
        else {
          Ember.run(resolve);
        }
      });
    });
  }

});
