//Import model(s)
const Message = require('../models/messages')

exports.index = async(req, res, next) => {
  if (res.locals.currentUser) { res.redirect('/member') }
  
  try { let messages = await Message.find().sort([['timeStamp', 'descending']])
    .populate([{
      path: 'user',
      model: 'User'
    }, {
      path: 'replies',
      model: 'Replies',
      populate: {
        path: 'user',
        model: 'User'
      }
    }]);

    res.render('index', { user: req.user, messages: messages }) }
    catch(err) { return next(err) }
};