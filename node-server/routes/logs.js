var express = require('express');
var router = express.Router();
var Log = require('../models/log.js');
var authentication = require('../utils/authedRequest.js').authentication;

/* GET log listing. */
router.get('/api/1/logs', authentication.authedReq, function (req, res, next) {
  var message = req.query.message;
  var type = req.query.type;
  var page = req.query.page;

  Log.model.search(page, message, type).then(function (result) {
    console.log(result);
    res.send(result);
  });
});

module.exports = router;
