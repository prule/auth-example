require('../utils/pagination.js');

var S = require('string');
var mongoose = require('mongoose-q')(require('mongoose'));
var Log = require('./log.js');

var pageSize = 10;

var userSchema = new mongoose.Schema({
  id: String,
  name: {type: String, required: 'required'},
  email: {
    type: String
  },
  facebookId: {
    type: String
  },
  googleId: {
    type: String
  },
  admin: Boolean,
  enabled: Boolean
});

userSchema.methods = {

  updateUser: function (name, email, facebookId, googleId, admin) {
    this.name = name;
    this.email = email;
    this.facebookId = facebookId;
    this.googleId = googleId;
    this.admin = S(admin).toBoolean();

    return this.saveQ();
  },

  marshall: function () {
    var user = {
      id: this._id,
      admin: this.admin,
      enabled: this.enabled
    };
    return user;
  }

};

userSchema.statics.createNew = function (name, email, facebookId, googleId, admin) {
  Log.model.insert('New user', Log.types.NEW_USER);
  return this.create({googleId: googleId, name: name, email: email, facebookId: facebookId, admin: admin});
};

userSchema.statics.findById = function (id) {
  return this.findOne({_id: id}).exec();
};


userSchema.statics.search = function (page, name, email) {
  var filter = {}
  if (name) {
    filter['name'] = new RegExp(name, 'i');
  }
  if (email) {
    filter['email'] = new RegExp(email, 'i');
  }

  return this.find(filter).paginate(page, pageSize, 'users');
};


userSchema.statics.findByGoogleIdOrCreate = function (googleId, name, email) {
  var self = this;
  return this.findOneQ({googleId: googleId})
    .then(function (user) {
      if (user != null) {
        return user;
      }
      return self.createQ({googleId: googleId, name: name, email: email});
    });
};


userSchema.statics.findByFacebookIdOrCreate = function (facebookId, name, email) {
  var self = this;
  return this.findOneQ({facebookId: facebookId})
    .then(function (user) {
      if (user != null) {
        return user;
      }
      return self.createQ({facebookId: facebookId, name: name, email: email});
    });
};

exports.model = mongoose.model('users', userSchema);