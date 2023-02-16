const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratSchema = new Schema({
   author: {
      type: String,
      required: true
   },
   rat: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
   }
});

const productSchema = new Schema({
   store: {
      type: String,
      required: true
   },
   storeId: {
      type: Schema.Types.ObjectId,
      ref: 'store'
   },
   img: {
      type: String,
      default: ''
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
   },
   color: {
      type: String,
      required: true
   },
   sizes: {
      type: [String],
      required: true
   },
   price: {
      type: Number,
      required: true,
      min: 0
   },
   rats: {
      type: [ratSchema],
      default: []
   }
}, {
   timestamps: true
});

var Product = mongoose.model('product', productSchema);
module.exports = Product;
