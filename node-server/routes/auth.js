var express = require('express');
var mongoose = require('mongoose-q')(require('mongoose'));
var config = require('config');
var Log = require('../models/log.js');

var
  logger = require('winston'),
  jwt = require('jsonwebtoken')
  ;
var authentication = require('../utils/authedRequest.js').authentication;

var router = express.Router();

/**
 * Load the model files
 */
var User = require('./../models/user.js');


router.get('/api/1/user/auth/me', authentication.authedReq, function (req, res, next) {
  "use strict";
  return res.send(200, req.userObject.marshall());
});

/**
 * FACEBOOK
 */
router.get('/api/1/user/auth/facebook', function (req, res, next) {
  var exchangeToken = req.query.authCode;

  var FB = require('fb');
  FB.api('oauth/access_token', {
    grant_type: 'fb_exchange_token',
    client_id: process.env.auth_facebook_client_id,
    client_secret: process.env.auth_facebook_client_secret,
    fb_exchange_token: exchangeToken

  }, function (result) {
    var accessToken = result.access_token;
    FB.setAccessToken(accessToken);
    FB.api('me', function (fbRes) {
      if (!fbRes || fbRes.error) {
        logger.info(fbRes.error);
        return res.send(401, {error: 'Invalid Facebook access token'});
      }
      else {
        var self = this;
        User.model.findOneQ({facebookId: fbRes.id})
          .then(function (user) {
            if (user == null) {
              User.model.createQ({facebookId: fbRes.id, name: fbRes.name, email: fbRes.email}).then(function (user) {
                Log.model.insert('New Facebook user created ' + user.name, 'New User');
                return res.send(200, createTokenForUser(user));
              }).catch(function (err) {
                return res.status(500).send({error: 'Error finding/creating user'});
              }).done();
            }
            else {
              Log.model.insert('Facebook login ' + user.name, 'Login');
              return res.status(200).send(createTokenForUser(user));
            }
          }).catch(function (err) {
            return res.status(500).send({error: 'Error finding/creating Facebook user'});
          }).done();
      }
    });
  });
});

/**
 * GOOGLE
 */
router.get('/api/1/user/auth/google', function (req, res, next) {
  var exchangeToken = req.query.authCode;

  var google = require('googleapis');
  var OAuth2 = google.auth.OAuth2;
  var plus = google.plus('v1');

  var CLIENT_ID = process.env.auth_google_client_id;
  var CLIENT_SECRET = process.env.auth_google_client_secret;
  var REDIRECT_URL = process.env.auth_google_redirect_uri;

  var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

  oauth2Client.getToken(exchangeToken, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token
    if (!err) {
      oauth2Client.setCredentials(tokens);
      plus.people.get({userId: 'me', auth: oauth2Client}, function (err, body) {
        if (!err) {
          User.model.findOneQ({googleId: body.id})
            .then(function (user) {
              if (user == null) {
                User.model.createQ({
                  googleId: body.id,
                  name: body.displayName,
                  email: body.emails[0].value
                }).then(function (user) {
                  Log.model.insert('New Google user created ' + user.name, 'New User');
                  return res.send(200, createTokenForUser(user));
                }).catch(function (err) {
                  return res.status(500).send({error: 'Error finding/creating user'});
                }).done();
              }
              else {
                Log.model.insert('Google login ' + user.name, 'Login');
                return res.status(200).send(createTokenForUser(user));
              }
            }).catch(function (err) {
              return res.status(500).send({error: 'Error finding/creating Google user'});
            }).done();

          //
          //
          //
          //
          //
          //
          //User.model.findByGoogleIdOrCreate(body.id, body.displayName, body.emails[0].value).then(function (user) {
          //  Log.model.insert('New Google user created '+user.name, 'New User');
          //  return res.status(200).send(createTokenForUser(user));
          //}, function (err) {
          //  logger.info(err.message);
          //  return res.status(500).send({error: 'Error finding/creating Google user'});
          //});
        }
        else {
          return res.status(500).send({error: 'Could not get user details'});
        }
      });
    }
    else {
      return res.status(500).send('Could not get token');
    }
  });
});

function createTokenForUser(user) {
  // any data we send back here will be assigned to the ember-simple-auth session
  // eg {{ session.admin }}
  return {
    token: 'Bearer ' + jwt.sign({userId: user._id}, process.env.jwt_secret),
    admin: user.admin
  };
}

module.exports = router;
