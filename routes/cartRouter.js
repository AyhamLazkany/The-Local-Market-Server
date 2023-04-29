var express = require('express');
var bodyParser = require('body-parser');
var Cart = require('../models/cart');
var authenticate = require('../authenticate');
var cors = require('./cors');

const cartRouter = express.Router();

cartRouter.use(bodyParser.json());

cartRouter.route('/')
   .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
   .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
      Cart.findOne({ user: req.user._id })
         .populate('products.product')
         .then((Cart) => {
            if (!Cart) {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ "exists": false });
            } else {
               if (Cart.products == []) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ "exists": false });
               } else {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ "exists": true, "Cart": Cart.products });
               }
            }
         }, (err) => next(err))
         .catch((err) => next(err));
   }).post(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Post operation is not supported on \'/Cart\'');
   }).put(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Put operation is not supported on \'/Cart\'');
   }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      Cart.findOneAndDelete({ user: req.user._id })
         .then(() => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Deleting Cart Successful' });
         }, (err) => next(err))
         .catch((err) => next(err));
   });

cartRouter.route('/:productId')
   .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
   .get(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Get operation is not supported on \'/Cart\'');
   }).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      Cart.findOne({ user: req.user._id })
         .then((cart) => {
            if (cart && cart.products.findIndex((prod) => prod._id == req.params.productId) == -1) {
               cart.products.push({ size: req.body.size, product: req.params.productId });
               cart.save()
                  .then(() => {
                     res.statusCode = 200;
                     res.setHeader('Content-type', 'application/json');
                     res.json({ success: true, status: 'Adding product Successful' });
                  }, (err) => next(err));
            } else if (!cart) {
               Cart.create({ user: req.user._id, products: { size: req.body.size, product: req.params.productId } })
                  .then(() => {
                     res.statusCode = 200;
                     res.setHeader('Content-type', 'application/json');
                     res.json({ success: true, status: 'Adding product Successful' });
                  }, (err) => next(err))
                  .catch((err) => next(err))
            } else {
               res.statusCode = 200;
               res.setHeader('Content-type', 'application/json');
               res.json({ success: false, status: 'product already exists' });
            }
         }, (err) => next(err))
         .catch((err) => next(err))
   }).put(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Put operation is not supported on \'/Cart\'');
   }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      Cart.findOne({ user: req.user._id })
         .then((cart) => {
            let index = cart.products.findIndex((prod) => prod._id == req.params.productId);
            cart.products.splice(index, 1);
            cart.save()
               .then((cart) => {
                  cart.populate('products.product')
                     .then((cart) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true, status: 'Deleting product success' });
                     }, (err) => next(err))
               }, (err) => next(err))
         }, (err) => next(err))
         .catch((err) => next(err));
   });

module.exports = cartRouter;