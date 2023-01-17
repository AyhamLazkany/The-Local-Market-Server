const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   img: {
      type: String,
      required: true
   },
   username: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   },
   firstname: {
      type: String,
      required: true
   },
   lastname: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   phone: {
      type: Number,
      required: true
   },
   seller: {
      type: Boolean,
      required: true
   }
}, {
   timestamps: true
});

var User = mongoose.model('user', userSchema);
module.exports = User;