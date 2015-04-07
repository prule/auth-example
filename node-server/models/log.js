require('../utils/pagination.js');

var mongoose = require('mongoose-q')(require('mongoose')),
  logger = require('winston')
  ;

var QueryFilter = require('../utils/queryFilter.js').QueryFilter;

var pageSize = 3;

exports.types = {
  NEW_USER: 'New user'
};

var logSchema = new mongoose.Schema({

  id: String,
  message: {type: String, required: 'required'},
  type: {type: String, required: 'required'},
  timestamp: {type: Date, default: Date.now}
});

logSchema.methods = {

  marshall: function () {
    var log = {
      id: this._id,
      message: this.message,
      type: this.type,
      timestamp: this.timestamp
    };
    return log;
  }

};

logSchema.statics = {

  insert: function (message, type) {
    return this.create({message: message, type: type});
  },

  search: function (page, message, type) {
    var filter = {};
    QueryFilter.regEx(filter, 'message', message);
    QueryFilter.regEx(filter, 'type', type);
    //return this.find(filter).paginate(page, pageSize, 'logs');
    return this.find(filter).sort({timestamp: -1}).paginate(page, pageSize, 'logs');
  }

}
;


exports.model = mongoose.model('logs', logSchema);