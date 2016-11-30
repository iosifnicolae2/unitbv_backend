avar mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CDN = require('../module/cdn');

// create a schema
var menuSchema = new Schema({
  name: { type: String, required: true},
  short_description : String,
  description : String,
  price : { type: String, required: true},
  quantity : String,
  categories:[{type:String, ref:'Category', required: true}],
  logo : String,
  large_image : String,
  created_at: { type: Date, default: Date.now },
  other:Object
});


dishSchema.set('toJSON', { getters: true });
dishSchema.set('toObject', { getters: true });

dishSchema.virtual('cdn_logo').get(function () {
  if(typeof this.logo !='undefined')
  return CDN.images+this.logo;
  return CDN.images+"null.svg";
});
dishSchema.virtual('cdn_large_image').get(function () {
  if(typeof this.large_image !='undefined')
  return CDN.images+this.large_image;
  return CDN.images+"null.svg";
});
// the schema is useless so far
// we need to create a model using it
var Dish = mongoose.model('Dish', dishSchema);

// make this available to our users in our Node applications
module.exports = Dish;
