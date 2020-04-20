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

/* View Edit all  Password  page. */
router.get('/', checkLoginUser,function(req, res, next) {
    res.redirect('/dashboard');
  });
  
  /* View Edit all  Password  page. */
  router.get('/edit/:id', checkLoginUser,function(req, res, next) {
    var LoginUsers = localStorage.getItem('LoginUser');
    var id = req.params.id;
   var getPassDetail = passModel.findById({_id:id});
   getPassDetail.exec(function(err,data){
      if(err) throw err;
      getPassCate.exec(function(err,data1){
      res.render('edit_password_detail', { title: ' View all  Password',LoginUser:LoginUsers,records:data1, record:data , success:''});
     });
    });
  });
  
  /* View Update all  Password  page. */
  router.post('/edit/:id', checkLoginUser,function(req, res, next) {
    var LoginUsers = localStorage.getItem('LoginUser');
    var id = req.params.id;
    var passcat=req.body.pass_cat;
    var project_name=req.body.project_name;
    var pass_details=req.body.pass_details;
    passModel.findByIdAndUpdate(id,
      {password_category:passcat,
        project_name:project_name,
        password_detail:pass_details
      }).exec(function(err,doc){
        if(err) throw err;
  
    var getPassDetail = passModel.findById({_id:id});
    getPassDetail.exec(function(err,data){
      if(err) throw err;
      getPassDetail.exec(function(err,data1){
      res.render('edit_password_detail', { title: ' View all  Password',LoginUser:LoginUsers,records:data1, record:data , success:'Password Updates Successfully'});
     });
    });
    });
  });
  
  
  /* GET Delete Password Listing page. */
  router.get('/delete/:id', checkLoginUser,function(req, res, next) {
    var LoginUsers = localStorage.getItem('LoginUser');
    var id = req.params.id;
    var getPassDetail = passModel.findByIdAndDelete(id);
    getPassDetail.exec(function(err){
      if(err) throw err;
       res.redirect('/view-all-password');
    });
  });
  
  
  


  
 
  
  module.exports = router;
