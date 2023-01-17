const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
   author: {
      type: String,
      required: true
   },
   comment: {
      type: String,
      required: true
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
   storeId: {
      type: String,
      required: true
   },
   img:{ 
      type: String,
      required: true
   },
   category:{ 
      type: String,
      required: true
   },
   title:{ 
      type: String,
      required: true
   },
   description:{ 
      type: String,
      required: true
   },
   quantity:{ 
      type: Number,
      required: true
   },
   price:{ 
      type: Number,
      required: true,
      min: 0
   },
   comments: {
      type: [commentSchema],
      required: true
   }
}, {
   timestamps: true
});

var Product = mongoose.model('product', productSchema);
module.exports = Product;
