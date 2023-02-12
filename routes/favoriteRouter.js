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
            if (favorites) {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json({ status: 'Fetching Favorites Successful', favorites: favorites.products });
            } else {
               var err = new Error('Not Found : You don\'t have a favorite products');
               err.status = 404;
               return next(err);
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
               favorite.populate('products')
                  .then((favorite) => {
                     res.statusCode = 200;
                     res.setHeader('Content-type', 'application/json');
                     res.json({ status: 'Fetching Favorite Successful', favorite: favorite.products.find(product => product._id = req.params.productId) });
                  }, (err) => next(err));
            } else if (favorite.products.indexOf(req.params.productId) == -1) {
               err = new Error('The product with id \'' + req.params.productId + '\' not found');
               err.status = 404;
               return next(err);
            } else {
               var err = new Error('Not Found : You don\'t have a favorite product');
               err.status = 404;
               return next(err);
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
                     favorite.populate('products')
                        .then((favorite) => {
                           res.statusCode = 200;
                           res.setHeader('Content-type', 'application/json');
                           res.json({ status: 'Adding Favorite Successful', favorite: favorite.products });
                        }, (err) => next(err))
                  }, (err) => next(err));
            } else if (!favorite) {
               Favorites.create({ user: req.user._id, products: req.params.productId })
                  .then((favorite) => {
                     favorite.populate('products')
                        .then((favorite) => {
                           res.statusCode = 200;
                           res.setHeader('Content-type', 'application/json');
                           res.json(favorite.products);
                        }, (err) => next(err));
                  }, (err) => next(err))
                  .catch((err) => next(err))
            } else {
               var err = new Error('This product is already in the favorite list');
               err.statusCode = 500;
               return next(err);
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
                        res.json(favorite);
                     }, (err) => next(err))
               }, (err) => next(err))
         }, (err) => next(err))
         .catch((err) => next(err));
   });

module.exports = favoriteRouter;