var express = require('express');
var bodyParser = require('body-parser');
var SaleRecs = require('../models/saleRecs');
var authenticate = require('../authenticate');
var cors = require('./cors');

const saleRecRouter = express.Router();

saleRecRouter.use(bodyParser.json());

saleRecRouter.route('/')
   .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
   .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
      SaleRecs.findOne({ user: req.user._id })
         .populate('products')
         .then((SaleRecs) => {
            if (!SaleRecs) {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ "exists": false });
            } else {
               if (SaleRecs.products == []) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ "exists": false, "SaleRecs": SaleRecs });
               } else {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ "exists": true, "SaleRecs": SaleRecs.products });
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

saleRecRouter.route('/:productId')
   .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
   .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
      SaleRecs.findOne({ user: req.user._id })
         .then((saleRec) => {
            if (saleRec && saleRec.products.indexOf(req.params.productId) !== -1) {
               saleRec.populate('products')
                  .then((saleRec) => {
                     res.statusCode = 200;
                     res.setHeader('Content-type', 'application/json');
                     res.json({ status: 'Fetching saleRec Successful', saleRec: saleRec.products.find(product => product._id = req.params.productId) });
                  }, (err) => next(err));
            } else if (saleRec.products.indexOf(req.params.productId) == -1) {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ "exists": false, "saleRec": saleRec.products });
            } else {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ "exists": false });
            }
         }, (err) => next(err))
         .catch((err) => next(err));
   }).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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