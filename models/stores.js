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
   category: {
      type: String,
      required: true
   },
   title: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   }
},{
   timestamps: true
});

var Store = mongoose.model('store', storeSchema);
module.exports = Store;