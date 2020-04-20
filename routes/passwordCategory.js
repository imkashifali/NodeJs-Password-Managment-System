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

/* GET Password Category Listing page. */
router.get('/', checkLoginUser,function(req, res, next) {
    var LoginUsers = localStorage.getItem('LoginUser');
    getPassCate.exec(function(err,data){
      if(err) throw err;
    res.render('password_category', { title: ' Password Category',LoginUser:LoginUsers,records:data });
    });
  });
  

/* GET Delete Password Category Listing page. */
router.get('/delete/:id', checkLoginUser,function(req, res, next) {
    var LoginUsers = localStorage.getItem('LoginUser');
    var passcat_ID = req.params.id;
    var passDelete = passCateModel.findByIdAndDelete(passcat_ID);
   passDelete.exec(function(err){
      if(err) throw err;
       res.redirect('/passwordCategory');
    });
  });
  
  /* GET Edit Password Category Listing page. */
  router.get('/edit/:id', checkLoginUser,function(req, res, next) {
    var LoginUsers = localStorage.getItem('LoginUser');
    var passcat_ID = req.params.id;
    console.log(passcat_ID);
   var passDelete = passCateModel.findById(passcat_ID);
   passDelete.exec(function(err,data){
      if(err) throw err;
      res.render('edit_pass_category', { title: ' Password Category',LoginUser:LoginUsers,errors:'',success:'',records:data, id:passcat_ID });
    });
  });
  
  /* POST UPDATE Password Category Listing page. */
  router.post('/edit/', checkLoginUser,function(req, res, next) {
    var LoginUsers = localStorage.getItem('LoginUser');
    var passcat_ID = req.body.id;
    var passwordCategory = req.body.passwordCategory;
    var update_passcatgory=passCateModel.findByIdAndUpdate(passcat_ID,{password_category:passwordCategory})
    update_passcatgory.exec(function(err,doc){
      if(err) throw err;
      res.redirect('/passwordCategory');
    });
  });
 
  
  module.exports = router;
