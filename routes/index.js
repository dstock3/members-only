const express = require('express');
const router = express.Router();

// Import controller
const admin_controller = require('../controllers/adminController');
const member_controller = require('../controllers/memberController');
const login_controller = require('../controllers/loginController');
const register_controller = require('../controllers/registerController');
const index_controller = require('../controllers/indexController');

// Index
router.get('/', index_controller.index);

// Member 

router.post('/member', member_controller.confirmMembership_post);
router.get('/member', member_controller.memberpage_get);
router.get('/members/:id', member_controller.userProfile_get);
router.get('/members', member_controller.allMembers_get);
router.post('/submitpost', member_controller.addMessage_post);
router.post('/submitreply', member_controller.addReply_post);

// Register 

router.get('/register', register_controller.register_get);
router.post('/register', register_controller.createUser_post);

// Login

router.get('/login', login_controller.login_get);
router.post('/login', login_controller.loginUser_post);

// Admin member

router.get('/admin', admin_controller.admin_get);
router.post('/admin', admin_controller.makeAdmin_post);
router.post('/delete', admin_controller.delete_post)
router.post('/deletereply', admin_controller.delete_reply);

router.get('/profile', admin_controller.profile_get);
router.post('/updateprofile', admin_controller.updateProfile);

// Logout

router.get('/logout', (req, res) =>{
  req.logout();
  res.redirect('/');
});

module.exports = router;