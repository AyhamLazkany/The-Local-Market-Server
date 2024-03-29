var express = require('express');
var bodyParser = require('body-parser');
var Products = require('../models/products');
var authenticate = require('../authenticate');
var cors = require('./cors');

const productRouter = express.Router();
productRouter.use(bodyParser.json());

/* GET products listing. */
productRouter.route('/')
  .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Products.find(req.query)
      .then((products) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(products);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Products.create(req.body)
      .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(product);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 404;
    res.end('Put operation is not supported on \'/products\'');
  }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Products.deleteMany(req.query)
      .then((delResult) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(delResult);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

productRouter.route('/:productId')
  .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(product);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 404;
    res.end('Post operation is not supported on \'/products/' + req.params.productId + '\'');
  }).put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Products.findByIdAndUpdate(req.params.productId, { $set: req.body }, { new: true })
      .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(product);
      }, (err) => next(err))
      .catch((err) => next(err));
  }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Products.findByIdAndRemove(req.params.productId)
      .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(product);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

productRouter.route('/:productId/comments')
  .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (product != null) {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(product.comments);
        } else {
          err = new Error('This Prouduct not found');
          err.status = 404;
          return err;
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  }).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (product != null) {
          product.comments.push(req.body);
          product.save()
            .then((product) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(product.comments);
            }, (err) => next(err));
        } else {
          err = new Error('This Prouduct not found');
          err.status = 404;
        }
      }, (err) => next(err))
  }).put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 404;
    res.end('Put operation is not supported on \'/products/' + req.params.productId + '\/comments\'');
  }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (product != null) {
          product.comments = [];
          product.save()
            .then((product) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(product.comments);
            }, (err) => next(err));
        } else {
          err = new Error('This Prouduct not found');
          err.status = 404;
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });

productRouter.route('/:productId/comments/:commentId')
  .options(cors.corsWithOptions, (req, res, next) => { res.sendStatus = 200; })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (product != null && product.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(product.comments.id(req.params.commentId));
        } else if (product == null) {
          err = new Error('This Prouduct not found');
          err.status = 404;
          return err;
        } else {
          err = new Error('This Comment not found');
          err.status = 404;
          return err;
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  }).post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 404;
    res.end('Post operation is not supported on \'/products/'
      + req.params.productId + '\/comments/' + req.params.commentId + '\'');
  }).put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (product != null && product.comments.id(req.params.commentId) != null) {
          if (req.body.rat)
            product.comments.id(req.params.commentId).rat = req.body.rat;
          if (req.body.comment)
            product.comments.id(req.params.commentId).comment = req.body.comment;
          product.save()
            .then((product) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(product.comments.id(req.params.commentId));
            }, (err) => next(err))
        } else if (product == null) {
          err = new Error('This Prouduct not found');
          err.status = 404;
          return err;
        } else {
          err = new Error('This Comment not found');
          err.status = 404;
          return err;
        }
      }, (err) => next(err))
  }).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.params.productId)
      .then((product) => {
        if (product != null && product.comments.id(req.params.commentId) != null) {
          product.comments.id(req.params.commentId).remove();
          product.save()
            .then((product) => {
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              res.json(product.comments);
            }, (err) => next(err))
        } else if (product == null) {
          err = new Error('This Prouduct not found');
          err.status = 404;
          return err;
        } else {
          err = new Error('This Comment not found');
          err.status = 404;
          return err;
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = productRouter;