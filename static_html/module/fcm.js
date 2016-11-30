var Fcm = require('../model/fcm');
var gcm = require('node-gcm');

var sender = new gcm.Sender('AIzaSyDlI52WSks9gRhkSQzTWOtYgtjIVVafMAA');

module.exports.update =  function(req,res){

console.log("update fcm",req.body,req.user);
  var fcm = new Fcm({
    client_id: req.user!=null?req.user._id:null,
    device_id:req.body.device_id,
    token:req.body.token
  });

    fcm.save(function (err, data) {
          if (err){
            return res.json({error:err,data:data});
          }
          res.json({success:true});
      });
}

module.exports.updateUser =  function(user_id,token){

console.log("update fcm user");
  var fcm = new Fcm({
    client_id: user_id,
    token: token
  });

    fcm.save(function (err, data) {
          if (err){
            console.log(err);
          }

      });
}


module.exports.sendNotification = function(client_id,title,icon,body,activity_launch){
  var message = new gcm.Message();

  var message = new gcm.Message({
    //  collapseKey: 'demo',
      priority: 'high',
    //  contentAvailable: true,
      delayWhileIdle: true,
      timeToLive: 3,
    //  restrictedPackageName: "somePackageName",
      dryRun: true,
      data: {
          activity: activity_launch
      },
      notification: {
          title: title,
          icon: icon,
          body: body
      }
  });


  FCM.findOne({client_id:client_id},function(err,user){
    if(err){
      return res.json({error:err});
    }
    if(user)
    sender.send(message, { registrationTokens: user.token }, function (err, response) {
    if(err)
        return res.json({error:err});
     else
        return res.json({response:response});

    });
    else{
      return res.json({error:"User doesn't exist!"});
    }
  })

}
