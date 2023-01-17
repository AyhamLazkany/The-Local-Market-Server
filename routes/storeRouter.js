var express = require('express');
var bodyParser = require('body-parser');
var Stores = require('../models/stores');

var storeRouter = express.Router();
storeRouter.use(bodyParser.json());

/* GET stores listing. */
storeRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = storeRouter;