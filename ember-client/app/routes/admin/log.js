import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteMixin, {
  perPage: 3,

  model: function (params) {
    return this.findPaged('log', params);
  },
  setupController: function (controller, model) {
    this._super(controller, model);
  }
});

