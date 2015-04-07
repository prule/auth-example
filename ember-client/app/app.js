import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

if (!window.console) {
  window.console = {
    log: function () {
    }
  };
}

Ember.MODEL_FACTORY_INJECTIONS = true;

if (true) {
  FB.init({appId: config.APP.FACEBOOK_AppId});

  function googleApiLoaded() {
    gapi.client.setApiKey(config.APP.GOOGLE_ClientApiKey);
  }
}

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
