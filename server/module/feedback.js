var Feedback = require('../model/feedback');
var colors = require('colors');

module.exports.add = function(req,res){
  var feedback = new Feedback({
    business:req.body.business_id,
    client_id:req.user!=null?req.user._id:null,
    content:req.body.feedback_content
  });

console.log("new feedback",feedback);

  feedback.save(function (err, data) {
        if (err){
          return res.json({error:err,data:data});
        }
        res.json({success:true});
      console.log("new feedback saved".yellow);
    });
}
