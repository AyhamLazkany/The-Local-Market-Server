var express = require('express');
var bodyParser = require('body-parser');
var SaleRecs = require('../models/saleRecs');
var authenticate = require('../authenticate');

const saleRecRouter = express.Router();

saleRecRouter.use(bodyParser.json());

saleRecRouter.route('/')
   .get(authenticate.verifyUser, (req, res, next) => {
      SaleRecs.findOne({ user: req.user._id })
         .populate('products')
         .then((SaleRecs) => {
            if (SaleRecs) {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({status: 'Fetching SaleRecs Successful', SaleRecs: SaleRecs.products});
            } else {
               var err = new Error('Not Found : You don\'t have a saleRec products');
               err.status = 404;
               return next(err);
            }
         }, (err) => next(err))
         .catch((err) => next(err));
   }).post((req, res, next) => {
      res.statusCode = 404;
      res.end('Post operation is not supported on \'/SaleRecs\'');
   }).put((req, res, next) => {
      res.statusCode = 404;
      res.end('Put operation is not supported on \'/SaleRecs\'');
   }).delete(authenticate.verifyUser, (req, res, next) => {
      SaleRecs.findOneAndDelete({ user: req.user._id })
         .then((saleRec) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ status: 'Deleting SaleRecs Successful', deletedSaleRecs: saleRec.products });
         }, (err) => next(err))
         .catch((err) => next(err));
   });

saleRecRouter.route('/:productId')
   .get(authenticate.verifyUser, (req, res, next) => {
      SaleRecs.findOne({ user: req.user._id })
         .then((saleRec) => {
            if (saleRec && saleRec.products.indexOf(req.params.productId) !== -1) {
               saleRec.populate('products')
                  .then((saleRec) => {
                     res.statusCode = 200;
                     res.setHeader('Content-type', 'application/json');
                     res.json({status: 'Fetching saleRec Successful', saleRec: saleRec.products.find(product => product._id = req.params.productId)});
                  }, (err) => next(err));
            } else if (saleRec.products.indexOf(req.params.productId) == -1) {
               err = new Error('The product with id \'' + req.params.productId + '\' not found');
               err.status = 404;
               return next(err);
            } else {
               var err = new Error('Not Found : You don\'t have a saleRec product');
               err.status = 404;
               return next(err);
            }
         }, (err) => next(err))
         .catch((err) => next(err));
   }).post(authenticate.verifyUser, (req, res, next) => {
      SaleRecs.findOne({ user: req.user._id })
         .then((saleRec) => {
            if (saleRec && saleRec.products.indexOf(req.params.productId) == -1) {
               saleRec.products.push(req.params.productId);
               saleRec.save()
                  .then((saleRec) => {
                     saleRec.populate('products')
                        .then((saleRec) => {
                           res.statusCode = 200;
                           res.setHeader('Content-type', 'application/json');
                           res.json({status: 'Adding saleRec Successful', saleRec: saleRec.products});
                        }, (err) => next(err))
                  }, (err) => next(err));
            } else if (!saleRec) {
               SaleRecs.create({ user: req.user._id, products: req.params.productId })
                  .then((saleRec) => {
                     saleRec.populate('products')
                        .then((saleRec) => {
                           res.statusCode = 200;
                           res.setHeader('Content-type', 'application/json');
                           res.json({status: 'Adding saleRec Successful', saleRec: saleRec.products});
                        }, (err) => next(err));
                  }, (err) => next(err))
                  .catch((err) => next(err))
            } else {
               var err = new Error('This product is already in the saleRec list');
               err.statusCode = 500;
               return next(err);
            }
         }, (err) => next(err))
         .catch((err) => next(err))
   }).put((req, res, next) => {
      res.statusCode = 404;
      res.end('Put operation is not supported on \'/SaleRecs\'');
   }).delete(authenticate.verifyUser, (req, res, next) => {
      SaleRecs.findOne({ user: req.user._id })
         .then((saleRec) => {
            saleRec.products.remove(req.params.productId);
            saleRec.save()
               .then((saleRec) => {
                  saleRec.populate('products')
                     .then((saleRec) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(saleRec);
                     }, (err) => next(err))
               }, (err) => next(err))
         }, (err) => next(err))
         .catch((err) => next(err));
   });

module.exports = saleRecRouter;