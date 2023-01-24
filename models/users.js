const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
   img: {
      type: String,
      default: 'assest/img/users/fox.jpg'
   },
   firstname: {
      type: String,
      default: ''
   },
   lastname: {
      type: String,
      default: ''
   },
   email: {
      type: String,
      default: '',
      unique: true
   },
   phone: {
      type: String,
      default: '',
      unique: true
   },
   seller: {
      type: Boolean,
      default: false
   }
}, {
   timestamps: true
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('user', userSchema);
module.exports = User;