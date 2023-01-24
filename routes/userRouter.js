var express = require('express');
var bodyParser = require('body-parser');
var Users = require('../models/users');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', (req, res, next) => {
  Users.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json({ status: 'Fetching all users Successful', users: users });
    }, (err) => next(err))
    .catch((err) => next(err));
});

userRouter.post('/signup', (req, res, next) => {
  Users.register(new Users({ username: req.body.username }), req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        if (req.body.img)
          user.img = req.body.img;
        if (req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        if (req.body.email)
          user.email = req.body.email;
        if (req.body.phone)
          user.phone = req.body.phone;
        if (req.body.saller) {
          let sallerPass = user.username.toString().split('.');
          if (sallerPass[1] == 'A0969277247a') {
            user.username = sallerPass[0];
            user.saller == true
          } else {
            user.saller = false;
          }
        }
        user.save()
          .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true, status: 'Registration Successful!',
              created_user: { _id: user._id, username: user.username, password: '********', saller: user.saller.toString }
            });
          }).catch((err) => next(err))
      }
    })
});

userRouter.route('/:userId')
  .get((req, res, next) => {
    Users.findById(req.params.userId)
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: 'Fetching the user Successful', user: user });
      }, (err) => next(err))
      .catch((err) => next(err))
  }).put((req, res, next) => {
    if (req.body.seller && req.body.seller === true)
      req.body.seller = false;
    Users.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true })
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: 'Updating user details Successful', user: user });
      }, (err) => next(err))
      .catch((err) => next(err))
  }).delete((req, res, next) => {
    Users.findByIdAndRemove(req.params.userId)
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: 'Updating user details Successful', user: user });
      }, (err) => next(err))
      .catch((err) => next(err))
  });


module.exports = userRouter;
