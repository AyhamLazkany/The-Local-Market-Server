const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
   size: {
      type: String,
      default: ''
   },
   product: {
      type: Schema.Types.ObjectId,
      ref: 'product'
   }
});

const cartSchema = new Schema({
   products: {
      type: [productSchema],
      default: [] 
   },
   userId: {
      type: String,
      default: ''
   },
   name: {
      type: String,
      default: ''
   },
   number: {
      type: String,
      default: ''
   },
   city: {
      type: String,
      default: ''
   },
   location: {
      type: String,
      default: ''
   },
   status: {
      type: String,
      default: ''
   }
});

const saleReceSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
   },
   carts: {
      type: [cartSchema],
      ref: 'product'
   }
});

var Favorite = mongoose.model('saleRec', saleReceSchema);
module.exports = Favorite;