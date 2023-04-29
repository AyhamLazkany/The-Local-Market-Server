var express = require('express');
var bodyParser = require('body-parser');
var SaleRecs = require('../models/saleRecs');
var Stores = require('../models/stores');
var authenticate = require('../authenticate');
var cors = require('./cors');

const saleRecRouter = express.Router();

saleRecRouter.use(bodyParser.json());

saleRecRouter.route('/')
   .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
   .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
      SaleRecs.findOne({ user: req.user._id })
         .populate('carts.products.product')
         .then((SaleRecs) => {
            if (!SaleRecs) {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ "exists": false });
            } else {
               if (SaleRecs.carts == []) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ "exists": false });
               } else {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ "exists": true, "SaleRecs": SaleRecs.carts });
               }
            }
         }, (err) => next(err))
         .catch((err) => next(err));
   }).post(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Post operation is not supported on \'/SaleRecs\'');
   }).put(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Put operation is not supported on \'/SaleRecs\'');
   }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      SaleRecs.findOneAndDelete({ user: req.user._id })
         .then((saleRec) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ status: 'Deleting SaleRecs Successful', deletedSaleRecs: saleRec.products });
         }, (err) => next(err))
         .catch((err) => next(err));
   });

saleRecRouter.route('/:cartId')
   .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
   .get(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Get operation is not supported on \'/SaleRecs\'');
   }).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      Stores.findById(req.body.storeId)
      .then((store) => {

      },(err) => next(err))
      .catch((err) => next(err))
      SaleRecs.findOne({ user: req.body.userId })
         .then((saleRec) => {
            if (saleRec && saleRec.cart.indexOf(req.params.productId) == -1) {
               saleRec.products.push(req.params.productId);
               saleRec.save()
                  .then((saleRec) => {
                     saleRec.populate('products')
                        .then((saleRec) => {
                           res.statusCode = 200;
                           res.setHeader('Content-type', 'application/json');
                           res.json({ status: 'Adding saleRec Successful', saleRec: saleRec.products });
                        }, (err) => next(err))
                  }, (err) => next(err));
            } else if (!saleRec) {
               SaleRecs.create({ user: req.user._id, products: req.params.productId })
                  .then((saleRec) => {
                     saleRec.populate('products')
                        .then((saleRec) => {
                           res.statusCode = 200;
                           res.setHeader('Content-type', 'application/json');
                           res.json({ status: 'Adding saleRec Successful', saleRec: saleRec.products });
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
   }).put(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Put operation is not supported on \'/SaleRecs\'');
   }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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