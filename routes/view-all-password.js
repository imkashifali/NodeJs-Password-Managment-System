var express = require('express');
var router = express.Router();
var userModel = require('../modules/user');
var passCateModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var bcrypt = require('bcryptjs');
//include jsonwebtoken
var jwt = require('jsonwebtoken');
//include Express Validator
const { check, validationResult } = require('express-validator');
//include paginate 

//add category data for print
var getPassCate = passCateModel.find({});
//add category data for print
var getAllPassword = passModel.find({});


//node-localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
//Createing MiddleWire For Prevent Dashboard
function checkLoginUser(req, res, next){
    var userToken = localStorage.getItem('userToken');
    try {
      var decoded = jwt.verify(userToken, 'loginToken');
    } catch(err) {
      res.redirect('/');
    }
    next();
  }

  //Createing MiddleWire For UserName Validation
function checkUserName(req, res, next){
    var username=req.body.uname;
    var checkExistuserName = userModel.findOne({username:username});
    checkExistuserName.exec((err,data)=>{
      if(err) throw err;
      if(data){
        return res.render('signup', { title: 'Sign Up page',msg:'UserName Already Exist Now' });
      }
      next();
    });
  };
  
  //Createing MiddleWire For Email Validation
function checkEmail(req, res, next){
    var email=req.body.email;
    var checkExistEmail = userModel.findOne({email:email});
    checkExistEmail.exec((err,data)=>{
      if(err) throw err;
      if(data){
        return res.render('signup', { title: 'Sign Up page',msg:'Email Already Exist Now' });
      }
      next();
    });
  };


/* View all  Password  page. */
router.get('/', checkLoginUser,function(req, res, next) {
    var LoginUsers = localStorage.getItem('LoginUser');
    
    getAllPassword.exec(function(err,data){
      if(err) throw err;
      res.render('view-all-password', { title: ' View all  Password',LoginUser:LoginUsers, records:data });
  
    });
  });

  /* View Edit all  Password  page. */
router.get('/', checkLoginUser,function(req, res, next) {
    res.redirect('/dashboard');
  });

  


  
 
  
  module.exports = router;
