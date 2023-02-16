var express = require('express');
var bodyParser = require('body-parser');
var authenticate = require('../authenticate');
var multer = require('multer');
var cors = require('./cors');

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'public/assets/img');
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname)
   },
});
const userStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'public/assets/img/users');
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname)
   },
});
const storeStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'public/assets/img/stores');
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname)
   },
});
const productStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'public/assets/img/products');
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname)
   },
});
const imageFileFilter = (req, file, cb) => {
   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      err = new Error('You can upload only image files!');
      return cb(err, false);
   }
   cb(null, true);
}
const upload = multer({ storage: storage, fileFilter: imageFileFilter });
const uploadUserImg = multer({ storage: userStorage, fileFilter: imageFileFilter });
const uploadStoreImg = multer({ storage: storeStorage, fileFilter: imageFileFilter });
const uploadProductImg = multer({ storage: productStorage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/:')
   .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
   .get(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('GET operation is not supported on \'/upload\'');
   }).post(cors.corsWithOptions, authenticate.verifyUser, upload.single('imageFile'), (req, res, next) => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(req.file);
   }).put(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('PUT operation is not supported on \'/imageUpload\'');
   }).delete(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('DELETE operation is not supported on \'/imageUpload\'');
   });

uploadRouter.route('/users')
   .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
   .get(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('GET operation is not supported on \'/upload\'');
   }).post(cors.corsWithOptions, authenticate.verifyUser, uploadUserImg.single('imageFile'), (req, res, next) => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(req.file);
   }).put(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('PUT operation is not supported on \'/upload\'');
   }).delete(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('DELETE operation is not supported on \'/upload\'');
   });

uploadRouter.route('/stores')
   .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
   .get(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('GET operation is not supported on \'/upload\'');
   }).post(cors.corsWithOptions, authenticate.verifyUser, uploadStoreImg.single('imageFile'), (req, res, next) => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(req.file);
   }).put(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('PUT operation is not supported on \'/upload\'');
   }).delete(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('DELETE operation is not supported on \'/upload\'');
   });

uploadRouter.route('/products')
   .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
   .get(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('GET operation is not supported on \'/upload\'');
   }).post(cors.corsWithOptions, authenticate.verifyUser, uploadProductImg.single('imageFile'), (req, res, next) => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json(req.file);
   }).put(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('PUT operation is not supported on \'/upload\'');
   }).delete(cors.corsWithOptions, (req, res) => {
      res.statusCode = 404;
      res.end('DELETE operation is not supported on \'/upload\'');
   });

module.exports = uploadRouter;