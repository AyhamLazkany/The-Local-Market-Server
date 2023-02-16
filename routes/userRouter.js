var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var Users = require('../models/users');
var authenticate = require('../authenticate');
var cors = require('./cors');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

userRouter.route('/')
  .get(cors.corsWithOptions, (req, res, next) => {
    Users.findOne(req.query)
      .then((users) => {
        if (users) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: false, status: '' });
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: '' });
        }
      }, (err) => next(err))
      .catch((err) => next(err));
  });

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        Users.findOne({ email: req.body.email })
          .then((user) => {
            if (!user) {
              Users.findOne({ phone: req.body.phone })
                .then((user) => {
                  if (!user) {
                    Users.register(new Users({ username: req.body.username }), req.body.password,
                      (err, newuser) => {
                        if (err) {
                          res.statusCode = 500;
                          res.setHeader('Content-Type', 'application/json');
                          res.json({ err: err });
                        } else {
                          passport.authenticate('local')(req, res, () => {
                            newuser.email = req.body.email;
                            newuser.phone = req.body.phone;
                            newuser.img = req.body.img;
                            newuser.save()
                              .then((user) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ success: 'true', status: 'Registration Successful!', user: user });
                              }, (err) => next(err))
                              .catch((err) => next(err));
                          });
                        }
                      })
                  } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: 'false', status: 'There is an user using this phone number!' });
                  }
                }, (err) => next(err))
                .catch((err) => next(err));
            } else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({ success: 'false', status: 'There is an user using this email!' });
            }
          }, (err) => next(err))
          .catch((err) => next(err));
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: 'false', status: 'There is an user using this username!' });
      }
    }, (err) => next(err))
    .catch((err) => next(err));
});

userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local', { session: false }), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  Users.findById(req.user._id)
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, token: token, status: 'Logged in Successfully!', user: user });
    }, (err) => next(err))
    .catch((err) => next(err))
});

userRouter.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({ status: 'JWT invalid!', success: false, err: info });
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({ status: 'JWT valid!', success: true, user: user });

    }
  })(req, res);
});

userRouter.route('/:username')
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Users.findOne({ username: req.params.username })
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
      }, (err) => next(err))
      .catch((err) => next(err))
  });
  userRouter.route('/isSeller/:username')
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Users.findOne({ username: req.params.username })
      .then((user) => {
        if(user.seller == false) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(false);
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(true);
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  });
userRouter.put('/editUser/:id',cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Users.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: 'Updating user details Successful', user: user });
      }, (err) => next(err))
      .catch((err) => next(err))
  });
userRouter.delete('/deleteUser/:_id',cors.corsWithOptions, (req, res, next) => {
  Users.findByIdAndDelete(req.params._id)
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'Updating user details Successful'});
    }, (err) => next(err))
    .catch((err) => next(err))
});

module.exports = userRouter;
