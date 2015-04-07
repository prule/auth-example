import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';



export default Ember.Route.extend({
  beforeModel: function () {
    if (this.get('session').get('isAuthenticated')) {
      this.transitionTo('home');
    }
  }
});

