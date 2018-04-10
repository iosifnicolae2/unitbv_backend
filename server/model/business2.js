var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CDN = require('../module/cdn');

// create a schema
var businessSchema = new Schema({
  name: { type: String, required: true },
  admin_id:  { type: String, required: true, ref: 'User' },
  short_description: String,
  description: String,
  phone: String,
  address: String,
  categories: [{ type: String, ref: 'Category', required: true }],
  logo: String,
  large_image: String,
  schedule: [{
    start_day: Number,
    end_day: Number,
    start_hour: String,
    end_hour: String,
  },],
  location: {
    type: [Number],// [<latitude>, <longitude>]
    index: '2dsphere',
  },
  created_at: { type: Date, default: Date.now },
  ban: { type: Boolean, default: false },
});

businessSchema.set('toJSON', { getters: true });
businessSchema.set('toObject', { getters: true });

businessSchema.virtual('cdn_logo').get(function () {
  if (typeof this.logo != 'undefined')
  return CDN.images + this.logo;
  return null;
});

businessSchema.virtual('cdn_large_image').get(function () {
  if (typeof this.large_image != 'undefined')
  return CDN.images + this.large_image;
  return null;
});
// the schema is useless so far
// we need to create a model using it
var Business = mongoose.model('Business', businessSchema);

// make this available to our users in our Node applications
module.exports = Business;
