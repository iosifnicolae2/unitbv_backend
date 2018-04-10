var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var feedbackSchema = new Schema({
  business: { type: String, ref: 'Business', required: true },
  client_id: String,
  device_id: String,
  content: Object,
});


// the schema is useless so far
// we need to create a model using it
var Feedback = mongoose.model('Feedback', feedbackSchema);

// make this available to our users in our Node applications
module.exports = Feedback;
