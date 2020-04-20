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

/* User Login Page page. */
router.post('/', function(req, res, next) {
  var username=req.body.uname;
  var password=req.body.password;
  var checkUser = userModel.findOne({username:username});
  checkUser.exec((err,data)=>{
    if(err) throw err;

//Using jsonwebToken match Database Id 
  var getUserId = data._id;
    //get database field name
    var getPassword = data.password;

    if(bcrypt.compareSync(password,getPassword)){
      ///intialzing JsonWebToken
      var token = jwt.sign({ userId: getUserId }, 'loginToken');
      ///intialzing node-localstorages
      localStorage.setItem('userToken', token);
      localStorage.setItem('LoginUser', username);
      res.redirect('/dashboard');
    }else{
      res.render('index', { title: 'Password Managment System',msg:'User & Password Invalid! ' });
    }
  });
});


/*  logout  Page. */
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('LoginUser');
  res.redirect('/');

});

/* GET Index page. */
router.get('/', function(req, res, next) {
  var LoginUsers = localStorage.getItem('LoginUser');
  if(LoginUsers){
    res.redirect('/dashboard');
  }else{
  res.render('index', { title: 'Password Managment System',msg:'' });
  }
});


/* GET Sign Up Page. */
router.get('/signup', function(req, res, next) {
  var LoginUsers = localStorage.getItem('LoginUser');
  if(LoginUsers){
    res.redirect('/dashboard');
  }else{
  res.render('signup', { title: 'Sign Up page', msg:''});
  }
});

/* Post Sign Up page For User Registration Process With MiddleWire. */
router.post('/signup', checkEmail,checkUserName,function(req, res, next) {
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var cPassword=req.body.cPassword;

  if(password != cPassword){
    res.render('signup', { title: 'Sign Up page',msg:'Password Not Matched' });
  }
  else{
    password =bcrypt.hashSync(req.body.password,10);
  var userDetail =new userModel({
    //DataBase Filed Name ||Form Field Name
    username:username,
    email:email,
    password:password
  });
  userDetail.save((err,doc)=>{
    if(err) throw err;
    res.render('signup', { title: 'Sign Up page',msg:'User Registrated Now' });
  });
}

});










module.exports = router;
