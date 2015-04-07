exports.QueryFilter = {
  /**
   * If the value is not null, add a regular expression constraint to the dict
   */
  regEx: function (dict, name, value) {
    if (value) {
      dict[name] = new RegExp(value, 'i');
    }
  },

  eq: function (dict, name, value) {
    if (value) {
      dict[name] = value;
    }
  }

};