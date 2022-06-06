//Import passport for login
const passport = require('passport')

exports.login_get = function(req, res, next){
  
    if (res.locals.currentUser) { res.redirect('/mem')}
  
  res.render('login', { message: req.flash('err') })
};

exports.loginUser_post = passport.authenticate('local', {
    successRedirect: '/member',
    failureRedirect: '/login',
    failureFlash: true
});