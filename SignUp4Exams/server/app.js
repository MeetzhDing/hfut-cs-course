const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');

const PrivateKey = "skey";

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const userinfoRouter = require('./routes/userinfo');
const subjectsRouter = require('./routes/subjects');
const adminRouter = require('./routes/admin');
const payRouter = require('./routes/pay');
const callbackRouter = require('./routes/callback');

const app = express();

app.use("*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
});

app.use(expressJWT({
  secret: PrivateKey
}).unless({
  path: ['/','/users','/users/forgetPassword', '/users/verify','/admin/login','/callback/alipay']  //除了此地址，其他的URL都需要验证
}));

app.use(function (err, req, res, next) {
  console.log(JSON.stringify(err));
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({state:false, message:"invalid token"});
  }
});

// view engine setup
let views = app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/userinfo',userinfoRouter);
app.use('/subjects',subjectsRouter);
app.use('/admin',adminRouter);
app.use('/pay',payRouter);
app.use('/callback',callbackRouter);

app.get('/getData', function (req, res) {
  res.send(req.user);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;

