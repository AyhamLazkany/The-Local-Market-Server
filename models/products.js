const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
   author: {
      type: String,
      required: true
   },
   authorId: {
      type: Schema.Types.ObjectId,
      ref: 'user'
   },
   comment: {
      type: String
   },
   rat: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
   }
}, {
   timestamps: true
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
   },
   quantity: {
      type: Number,
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
   comments: {
      type: [commentSchema]
   }
}, {
   timestamps: true
});

var Product = mongoose.model('product', productSchema);
module.exports = Product;
