var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CDN = require('../module/cdn');

// create a schema
var userSchema = new Schema({
  username: { type : String , unique : true, required : true, dropDups: true },
  password: { type : String ,  required : true},
  displayName: {type: String, default:'Anonymous'},
  birthday : Date,
  email:  String,
  picture:  String,
  email_validated: {type:Boolean, default:false},
  user_type : {type:Number,default:0,  required : true},
  trophies:[{type:String,ref:'Trophy'}],
  gifts:[{type:String,ref:'Gift'}],
  ban:{type:Boolean,default:false},
  points:{type:Number,default:0},
  referals:{type:Number,default:0},
  feedbacks:{type:Number,default:0},
  vip_coins:{type:Number,default:0},
  visits:{type:Number,default:0},
});

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  delete obj.ban;
  delete obj.email_validated;
  delete obj.user_type;
  if(obj.picture)
  obj.picture = CDN.images+obj.picture;
  return obj;
}

userSchema.set('toJSON', { getters: true });
userSchema.set('toObject', { getters: true });

userSchema.virtual('cdn_picture').get(function () {
  if(this.picture)
  return CDN.images+this.picture;
  return null;
});

userSchema.methods.birthdayFormat = function() {
  return new Date(this.birthday).toISOString().slice(0, 10);
}

/*
User type:
0 - normal user
1 - Business
2- Admin
*/
// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
