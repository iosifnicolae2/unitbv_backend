var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CDN = require('../module/cdn');

// create a schema
var postSchema = new Schema({
  admin_id:  { type: String, required: true , ref:'User'},
  content : String,
  content_html : String,
  images : [{
  src:String,
  width:String,
  height:String
}],
  videos : [String],
  location : {
    type :[Number],// [<latitude>, <longitude>]
   index: '2dsphere'
   },
   poi_id:String,
  created_at: { type: Date, default: Date.now },
  ban:{type:Boolean,default:false},
  stats:{
    impressions:{type:Number,default:0},
    likes:{type:Number,default:0},
    likers:[{type:String, ref:'User'}]
  },
  other:Object,
  comments:[{
    author_id:{ type: String, required: true , ref:'User'},
    content:{ type: String, required: true },
    likes:{ type: Number, default:0},
    created_at: { type: Date, default: Date.now }
  }]
});


postSchema.set('toJSON', { getters: true });
postSchema.set('toObject', { getters: true });



// the schema is useless so far
// we need to create a model using it
var Post = mongoose.model('Post', postSchema);

// make this available to our users in our Node applications
module.exports = Post;
