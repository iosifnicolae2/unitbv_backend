var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var queueElementAPsSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  client_id: { type: String, required: true},
  APs : [{
    ap_name: String,
    ap_level: Number
  }],
});


queueElementAPsSchema.set('toJSON', { getters: true });
queueElementAPsSchema.set('toObject', { getters: true });

queueElementAPsSchema.virtual('in_the_queue_probaility').get(function () {
  // TODO(iosif) we need to calculate the probability that this client is in the queue.
  return 75;
});

queueElementAPsSchema.virtual('in_the_queue').get(function () {
  return this.in_the_queue_probaility > 70;
});

var QueueElementAPs = mongoose.model('QueueElementAPs', queueElementAPsSchema);

module.exports = QueueElementAPs;
