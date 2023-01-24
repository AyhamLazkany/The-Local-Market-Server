var express = require('express');
var bodyParser = require('body-parser');
var Stores = require('../models/stores');
var Products = require('../models/products');

const storeRouter = express.Router();
storeRouter.use(bodyParser.json());

/* GET stores listing. */
storeRouter.route('/')
  .options((req, res) => { res.sendStatus(200); })
  .get((req, res, next) => {
    Stores.find({})
      .then((stores) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(stores);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).post((req, res, next) => {
    Stores.create(req.body)
      .then((store) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(store);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).put((req, res, next) => {
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
  .options((req, res) => { res.sendStatus(200); })
  .get((req, res, next) => {
    Stores.findById(req.params.storeId)
      .then((store) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(store);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).post((req, res, next) => {
    res.statusCode = 404;
    res.end('Post operation is not supported on \'/stores/' + req.params.storeId + '\'');
  }).put((req, res, next) => {
    Stores.findByIdAndUpdate(req.params.storeId, { $set: req.body }, { new: true })
      .then((store) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(store);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).delete((req, res, next) => {
    Stores.findByIdAndRemove(req.params.storeId)
      .then((store) => {
        Products.deleteMany({ storeId: store._id })
        .then((delResult) => {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(store);
        }, (err) => next(err))
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = storeRouter;