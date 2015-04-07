import Base from 'simple-auth/authorizers/base';
import Ember from 'ember';

/**
 * Add the authorization token to each request to the server. This is the token that the server generated after
 * retrieving the user information from the source (eg facebook or google). It is a JWT token which contains
 * information the server can use to identify the user.
 */
export default Base.extend({
  authorize: function (jqXHR, requestOptions) {
    var accessToken = this.get('session.accessToken');
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(accessToken)) {
      jqXHR.setRequestHeader('Authorization', accessToken);
    }
  }
});
