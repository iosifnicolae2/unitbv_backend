var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CDN = require('../module/cdn');

// create a schema
var trophySchema = new Schema({
  name: String,
  description: String,
  picture_url: String,
  value: Number,
  business: { type: String, ref: 'Business', required: true },
});

trophySchema.set('toJSON', { getters: true });
trophySchema.set('toObject', { getters: true });

trophySchema.virtual('cdn_picture_url').get(function () {
  if (this.picture_url)
  return CDN.images + this.picture_url;
  return null;
});
// the schema is useless so far
// we need to create a model using it
var Trophy = mongoose.model('Trophy', trophySchema);

// make this available to our users in our Node applications
module.exports = Trophy;
