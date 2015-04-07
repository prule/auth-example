import Ember from 'ember';
import request from 'ic-ajax';

export default {
  /**
   * Send token to server so server can request user id from Facebook
   * Return the token supplied by the server and any other useful user information so ember-simple-auth can store it in the session
   */
  resolveCodeToToken: function (type, token, resolve, reject) {
    request({
      url: '/user/auth/' + type,
      data: {authCode: token}
    }).then(function (response) {
        Ember.run(function () {
          resolve({
            accessToken: response.token,
            admin: response.admin
          });
        });
      }
    );
    // todo handle error
  }


};
