//Import model(s)
const User = require('../models/users')

//Import bcrypt
const bcrypt = require('bcryptjs');

//Import validator
const { body, validationResult } = require('express-validator')

exports.register_get = function(req, res, next) {
  res.render('register', {title: 'Register'})
};

exports.createUser_post = [

    // Validate fields

    body('username').trim().isLength({min: 2}).escape().withMessage('At minimum, your username must be 4 characters long'),
    body('password').trim().isLength({min: 5}).escape().withMessage('At minimum, your password must be 5 characters long'),
    body('confirmPassword').trim().isLength({min: 5}).escape().withMessage('At minimum, your password must be 5 characters long')
    .custom( async(value, {req }) => {

      if(value !== req.body.password) {
          throw new Error('Passwords do not match')
      }

      return true;

    }),
    
    async (req, res, next) => {
      const errors = validationResult(req)
      
      if (!errors.isEmpty()) {
        return res.render('register', {title: 'Register', errors: errors.errors, username: req.body.username })
      }

      try {
        const userExists = await User.findOne({username: req.body.username});

        if (userExists !== null) {
           return res.render('register', {title: 'Register', usernameExists: 'Username already exists'})
        }
          bcrypt.hash(req.body.password, 12, (err, hashedPassword) => {

            const user = new User({
              username: req.body.username,
              password: hashedPassword,
              admin: false,
              member: false,
              avatar: req.body.avatar

            })

            user.save(err => {
              if (err) { return next(err) }
              res.redirect('/login')
            })
        })
      }  catch(err) { return next(err) }
    }
];