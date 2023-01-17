var express = require('express');
var bodyParser = require('body-parser');
var Products = require('../models/products');

var productRouter = express.Router();
productRouter.use(bodyParser.json());

/* GET products listing. */
productRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = productRouter;