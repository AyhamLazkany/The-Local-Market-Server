var express = require('express');
var bodyParser = require('body-parser');
var BayRecs = require('../models/bayRecs');
var authenticate = require('../authenticate');
var cors = require('./cors');

const bayRecRouter = express.Router();

bayRecRouter.use(bodyParser.json());

bayRecRouter.route('/')
   .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
   .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
      BayRecs.findOne({ user: req.user._id })
         .populate('products')
         .then((BayRecs) => {
            if (!BayRecs) {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ "exists": false });
            } else {
               if (BayRecs.products == []) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ "exists": false, "BayRecs": BayRecs.products });
               } else {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ "exists": true, "BayRecs": BayRecs.products });
               }
            }
         }, (err) => next(err))
         .catch((err) => next(err));
   }).post(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Post operation is not supported on \'/BayRecs\'');
   }).put(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Put operation is not supported on \'/BayRecs\'');
   }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      BayRecs.findOneAndDelete({ user: req.user._id })
         .then((bayRec) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ status: 'Deleting BayRecs Successful', deletedRecs: bayRec.products });
         }, (err) => next(err))
         .catch((err) => next(err));
   });

bayRecRouter.route('/:productId')
   .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
   .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
      BayRecs.findOne({ user: req.user._id })
         .then((bayRec) => {
            if (bayRec && bayRec.products.indexOf(req.params.productId) !== -1) {
               bayRec.populate('products')
                  .then((bayRec) => {
                     res.statusCode = 200;
                     res.setHeader('Content-type', 'application/json');
                     res.json({ status: 'Fetching bayRec Successful', bayRec: bayRec.products.find(product => product._id = req.params.productId) });
                  }, (err) => next(err));
            } else if (bayRec.products.indexOf(req.params.productId) == -1) {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ "exists": false, "bayRec": bayRec.products });
            } else {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ "exists": false });
            }
         }, (err) => next(err))
         .catch((err) => next(err));
   }).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      BayRecs.findOne({ user: req.user._id })
         .then((bayRec) => {
            if (bayRec && bayRec.products.indexOf(req.params.productId) == -1) {
               bayRec.products.push(req.params.productId);
               bayRec.save()
                  .then((bayRec) => {
                     bayRec.populate('products')
                        .then((bayRec) => {
                           res.statusCode = 200;
                           res.setHeader('Content-type', 'application/json');
                           res.json({ status: 'Adding bayRec Successful', bayRec: bayRec.products });
                        }, (err) => next(err))
                  }, (err) => next(err));
            } else if (!bayRec) {
               BayRecs.create({ user: req.user._id, products: req.params.productId })
                  .then((bayRec) => {
                     bayRec.populate('products')
                        .then((bayRec) => {
                           res.statusCode = 200;
                           res.setHeader('Content-type', 'application/json');
                           res.json({ status: 'Adding bayRec Successful', bayRec: bayRec.products });
                        }, (err) => next(err));
                  }, (err) => next(err))
                  .catch((err) => next(err))
            } else {
               var err = new Error('This product is already in the bayRec list');
               err.statusCode = 500;
               return next(err);
            }
         }, (err) => next(err))
         .catch((err) => next(err))
   }).put(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Put operation is not supported on \'/BayRecs\'');
   }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      BayRecs.findOne({ user: req.user._id })
         .then((bayRec) => {
            bayRec.products.remove(req.params.productId);
            bayRec.save()
               .then((bayRec) => {
                  bayRec.populate('products')
                     .then((bayRec) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(bayRec);
                     }, (err) => next(err))
               }, (err) => next(err))
         }, (err) => next(err))
         .catch((err) => next(err));
   });

module.exports = bayRecRouter;