avar mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var queueElementWazeSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  client_id: { type: String, required: true},
  number_of_clients : { type: Number, required: true},
});


queueElementWazeSchema.set('toJSON', { getters: true });
queueElementWazeSchema.set('toObject', { getters: true });

var QueueElementWaze = mongoose.model('QueueElementWaze', queueElementWazeSchema);

module.exports = QueueElementWaze;
