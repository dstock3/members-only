//Import model(s)
const Message = require('../models/messages')
const Reply = require('../models/replies')
const User = require('../models/users')

//Import validator
const { body, validationResult } = require('express-validator')

exports.admin_get = (req, res, next) => {
    res.render('admin', { title:'Admin login', user: res.locals.currentUser });
};

exports.makeAdmin_post = [
  //Check admin password  
  body('password').trim().isLength({max: 4}).escape().custom(async(value,{req}) => {
    if (value !== process.env.ADMIN_CODE) { throw new Error('Password is incorrect') }
    return true;
  }),

  async(req, res, next) =>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
      return res.render('admin', { title:'Admin login', admin: req.user.admin, message: 'Password is incorrect'});
    }
    
    const updatedUser = await User.findOne({username: res.locals.currentUser.username});
    updatedUser.admin = true;
    
    await updatedUser.save( err => {
      if (err){ return next(err) }
      console.log('User now has administrative privileges');
      res.redirect('/mem');
    })
  }
]

exports.delete_post = function(req, res, next) {
    
    const messageId= req.body.messageId
    
    User.findOneAndUpdate(
      {_id: req.body.userId},
      {$pull: { messages: req.body.messageId }
      }, function(err, id){
        
        if (err) { return next(err) }
        
        Message.findByIdAndDelete(messageId, function(err, docs){
          if (err) { return next(err) }
          res.redirect('/mem')
    })
  })
};

exports.delete_reply = function(req, res, next) {
    const id =req.body.replyId
    Message.findOneAndUpdate(
        {_id: req.body.messageId},
        {$pull:{
        replies: id
        }
    }, function (err, replyId) {

        if (err){ return next(err) }
        Reply.findByIdAndDelete(id, function(err, docs) {
            if (err){ return next(err) }

            res.redirect('/mem')
        })
    })
};

exports.profile_get = function(req, res, next){
  res.render('profile', { user: res.locals.currentUser })
};

exports.updateProfile = async function(req, res, next){
  const userToUpdate = await User.findOne({_id: res.locals.currentUser._id})
  
  userToUpdate.save(err =>{
    if (err) { return next(err) }
    res.redirect('/login')
  })
}