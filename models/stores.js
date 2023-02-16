const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
   img: {
      type: String,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   owner: {
      type: String,
      required: true
   },
   ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'user'
   },
   type: {
      type: String,
      required: true
   },
   phone: {
      type: String,
      required: true
   },
   fbsrc: {
      type: String,
      required: true
   },
   categories: {
      type: [String],
      required: true
   },
   description: {
      type: String,
      required: true
   }
}, {
   timestamps: true
});

var Store = mongoose.model('store', storeSchema);
module.exports = Store;