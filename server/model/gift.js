var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CDN = require('../module/cdn');
// create a schema
var giftSchema = new Schema({
  title: String,
  short_description: String,
  description: String,
  picture_url: String,
  business: { type: String, ref: 'Business', required: true },
});

giftSchema.set('toJSON', { getters: true });
giftSchema.set('toObject', { getters: true });

giftSchema.virtual('cdn_picture_url').get(function () {
  if (this.picture_url)
  return CDN.images + this.picture_url;
  return null;
});

// the schema is useless so far
// we need to create a model using it
var Gift = mongoose.model('Gift', giftSchema);

// make this available to our users in our Node applications
module.exports = Gift;
