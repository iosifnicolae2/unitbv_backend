module.exports = function(req,res,next){
  res.locals.config = {
    websiteName : "Unitbv portal"

  }
  next();
}
