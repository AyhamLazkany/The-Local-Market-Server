var express = require('express');
var bodyParser = require('body-parser');
var Favorites = require('../models/favorites');
var authenticate = require('../authenticate');
var cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
   .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
   .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
      Favorites.findOne({ user: req.user._id })
         .populate('products')
         .then((favorites) => {
            if (!favorites) {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ "exists": false });
            } else {
               if (favorites.products == []) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ "exists": false });
               } else {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ "exists": true, "favorites": favorites.products });
               }
            }
         }, (err) => next(err))
         .catch((err) => next(err));
   }).post(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Post operation is not supported on \'/Favorites\'');
   }).put(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Put operation is not supported on \'/Favorites\'');
   }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      Favorites.findOneAndDelete({ user: req.user._id })
         .then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ status: 'Deleting Favorites Successful', deletedFavs: favorite.products });
         }, (err) => next(err))
         .catch((err) => next(err));
   });

favoriteRouter.route('/:productId')
   .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
   .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
      Favorites.findOne({ user: req.user._id })
         .then((favorite) => {
            if (favorite && favorite.products.indexOf(req.params.productId) !== -1) {
               res.statusCode = 200;
               res.setHeader('Content-type', 'application/json');
               res.json({ exists: true });
            } else {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ exists: false });
            }
         }, (err) => next(err))
         .catch((err) => next(err));
   }).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      Favorites.findOne({ user: req.user._id })
         .then((favorite) => {
            if (favorite && favorite.products.indexOf(req.params.productId) == -1) {
               favorite.products.push(req.params.productId);
               favorite.save()
                  .then((favorite) => {
                     res.statusCode = 200;
                     res.setHeader('Content-type', 'application/json');
                     res.json({ success: true, status: 'Adding Favorite Successful' });
                  }, (err) => next(err));
            } else if (!favorite) {
               Favorites.create({ user: req.user._id, products: req.params.productId })
                  .then((favorite) => {
                     favorite.populate('products')
                        .then((favorite) => {
                           res.statusCode = 200;
                           res.setHeader('Content-type', 'application/json');
                           res.json({ success: true, status: 'Adding Favorite Successful' });
                        }, (err) => next(err));
                  }, (err) => next(err))
                  .catch((err) => next(err))
            } else {
               res.statusCode = 200;
               res.setHeader('Content-type', 'application/json');
               res.json({ success: false, status: 'Favorite already exists' });
            }
         }, (err) => next(err))
         .catch((err) => next(err))
   }).put(cors.corsWithOptions, (req, res, next) => {
      res.statusCode = 404;
      res.end('Put operation is not supported on \'/Favorites\'');
   }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      Favorites.findOne({ user: req.user._id })
         .then((favorite) => {
            favorite.products.remove(req.params.productId);
            favorite.save()
               .then((favorite) => {
                  favorite.populate('products')
                     .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true, status: 'Deleting favorite success' });
                     }, (err) => next(err))
               }, (err) => next(err))
         }, (err) => next(err))
         .catch((err) => next(err));
   });

module.exports = favoriteRouter;