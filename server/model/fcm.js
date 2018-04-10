var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var FCMSchema = new Schema({
  client_id: String,
  device_id: String,
  token: String,
});


// the schema is useless so far
// we need to create a model using it
var Fcm = mongoose.model('Fcm', FCMSchema);

// make this available to our users in our Node applications
module.exports = Fcm;
