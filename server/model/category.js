var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CDN = require('../module/cdn');
// create a schema
var categorySchema = new Schema({
  name: { type: String, required: true },
  short_description: String,
  description: String,
  color: { type: String, default: '#6cd26c' },
  logo: String,
  created_at: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },
});

categorySchema.set('toJSON', { getters: true });
categorySchema.set('toObject', { getters: true });

categorySchema.virtual('cdn_logo').get(function () {
  if (typeof this.logo != 'undefined')
  return CDN.images + this.logo;
  return CDN.images + 'null.svg';
});
// the schema is useless so far
// we need to create a model using it
var Category = mongoose.model('Category', categorySchema);

// make this available to our users in our Node applications
module.exports = Category;
