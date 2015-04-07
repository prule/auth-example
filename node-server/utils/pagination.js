/**
 * Small modification on https://github.com/moveline/mongoose-pagination/blob/master/lib/pagination.js to support promises
 */

var mongoose = require('mongoose');

mongoose.Query.prototype.paginate = function paginate(page, limit, name) {
  page = page || 1;
  limit = limit || 10;

  var query = this;
  var model = this.model;
  var skipFrom = (page * limit) - limit;

  query = query.skip(skipFrom).limit(limit);

  return query.exec().then(function (docs) {
    return model.count(query._conditions).exec().then(function (total) {
      var data = {
        meta: {
          total: total,
          total_pages: Math.ceil(total / limit),
          totalPages: Math.ceil(total / limit)
        }
      };
      data[name] = marshal(docs);
      return data;
    });
  });
};

function marshal(docs) {
  // todo test if the model has a marshall method
  for (i = 0; i < docs.length; i++) {
    docs[i] = docs[i].marshall();
  }
  return docs;
}