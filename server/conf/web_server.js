module.exports = function(req,res,next){
  res.locals.config = {
    websiteName : "Cantina Universitatii Transilvania."

  }
  next();
}
