import Ember from "ember";
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  beforeModel: function () {
    this.transitionTo('home');
  },

  actions: {

    // action to trigger authentication with Facebook
    authenticateWithFacebook: function () {
      var self = this;
      self.get('session').authenticate('authenticator:facebook', {})
        .then(function () {
          self.transitionTo('home');
        });
    },

    // action to trigger authentication with Google+
    authenticateWithGooglePlus: function () {
      var self = this;
      this.get('session').authenticate('authenticator:google', {})
        .then(function () {
          self.transitionTo('home');
        });
    },

    sessionAuthenticationSucceeded: function () {
      this.transitionTo('home');
    },

    sessionInvalidationSucceeded: function () {
      this.transitionTo('home');
    }

  }

});
