var express = require('express');
var bodyParser = require('body-parser');
var authenticate = require('../authenticate');
var multer = require('multer');
var cors = require('./cors');

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'public/images');
   },
   filename: (req,file,cb) => {
      cb(null, file.originalname)
   },
});
const imageFileFilter = (req, file, cb) => {
   if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      err = new Error('You can upload only image files!');
      return cb(err,false);
   }
   cb(null, true);
}
const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req,res,next) => {
   res.statusCode = 404;
   res.end('GET operation is not supported on \'/imageUpload\'');
}).post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'),(req,res,next) => {
      res.statusCode = 200;
      res.setHeader('Content-type','application/json');
      res.json(req.file);
}).put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
   res.statusCode = 404;
   res.end('PUT operation is not supported on \'/imageUpload\'');
}).delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
   res.statusCode = 404;
   res.end('DELETE operation is not supported on \'/imageUpload\'');
});

module.exports = uploadRouter;