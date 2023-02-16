var express = require('express');
var bodyParser = require('body-parser');
var Stores = require('../models/stores');
var Products = require('../models/products');
var authenticate = require('../authenticate');
var cors = require('./cors');

const storeRouter = express.Router();
storeRouter.use(bodyParser.json());

/* GET stores listing. */
storeRouter.route('/')
  .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
  .get(cors.cors, (req, res, next) => {
    Stores.find(req.query)
      .then((stores) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(stores);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Stores.create(req.body)
      .then((store) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(store);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 404;
    res.end('Put operation is not supported on \'/stores\'');
  });
/* !!That request so dangerous!! 
.delete((req,res,next) => {
   Stores.deleteMany({})
   .then((delResult) => {
      res.statusCode = 200;
      res.setHeader('Content-type','application/json');
      res.json(delResult);
   },(err) => next(err))
   .catch((err) => next(err));
})
*/

storeRouter.route('/:storeId')
  .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Stores.findById(req.params.storeId)
      .then((store) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(store);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 404;
    res.end('Post operation is not supported on \'/stores/' + req.params.storeId + '\'');
  }).put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Stores.findByIdAndUpdate(req.params.storeId, { $set: req.body }, { new: true })
      .then((store) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(store);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Stores.findByIdAndRemove(req.params.storeId)
      .then((store) => {
        Products.deleteMany({ storeId: store._id })
          .then(() => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(store);
          }, (err) => next(err))
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = storeRouter;