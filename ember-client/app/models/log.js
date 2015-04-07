import DS from 'ember-data';

export default DS.Model.extend({
  message: DS.attr('string'),
  type: DS.attr('string'),
  timestamp: DS.attr('date')
});
