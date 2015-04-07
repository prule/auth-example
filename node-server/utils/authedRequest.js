var User = require('./../models/user.js');


exports.authentication = {

  authedReq: function (req, res, next) {
    "use strict";
    //console.log('request user is '+req.user.userId);

    // get the JWT payload
    if (req.user) {
      var userId = req.user.userId;
      // put the full user object on the request
      User.model.findById(userId).then(function (user) {
        console.log('user is');
        console.log(user);
        if (!user.enabled) {
          console.log('user not enabled');
          res.send(401, 'disabled user...');
        }
        else {
          req.userObject = user;
          next();
        }
      });
    }
    else {
      res.send(403, 'not auth...');
    }
  },

  adminReq: function (req, res, next) {
    "use strict";
    // get the JWT payload
    var userId = req.user.userId;
    // put the full user object on the request
    User.model.findById(userId).then(function (user) {
      console.log('user is');
      console.log(user);
      if (!user.enabled) {
        res.send(401, 'disabled user...');
      }
      else if (!user.admin) {
        res.send(401, 'not allowed...');
      }
      else {
        req.userObject = user;
        next();
      }
    });
  }
};