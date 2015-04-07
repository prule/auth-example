/* jshint node: true */

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'ember-client',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    contentSecurityPolicy: {
      'report-uri': "'self' static.ak.facebook.com www.facebook.com s-static.ak.facebook.com/connect/ connect.facebook.net",
      'default-src': "'self' static.ak.facebook.com www.facebook.com s-static.ak.facebook.com/connect/ onnect.facebook.net/ accounts.google.com",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net maps.googleapis.com maps.gstatic.com apis.google.com",
      'font-src': "'self' fonts.gstatic.com netdna.bootstrapcdn.com fonts.googleapis.com",
      'connect-src': "'self' localhost:8002 www.facebook.com connect.facebook.net",
      'img-src': "'self'",
      'style-src': "'self' fonts.googleapis.com netnda.bootstrapcdn.com",
      'media-src': "'self'"
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV['simple-auth'] = {
    authorizer: 'authorizer:custom',
    crossOriginWhitelist: ['*'],
    authenticationRoute: 'index',
    routeAfterAuthentication: 'home',
    routeIfAlreadyAuthenticated: 'home'
  };

  console.log(environment);
  if (environment === 'development') {
    ENV.APP.FACEBOOK_AppId = process.env.FACEBOOK_AppId;
    ENV.APP.BACKEND_URL = process.env.BACKEND_URL;
    ENV.APP.GOOGLE_ClientApiKey = process.env.GOOGLE_ClientApiKey;
    ENV.APP.Google_ClientId = process.env.Google_ClientId;
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }
  console.log(ENV.APP);

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }
  return ENV;
};
