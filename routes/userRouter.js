var express = require('express');
var bodyParser = require('body-parser');
var Users = require('../models/users');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = userRouter;
