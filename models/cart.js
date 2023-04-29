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
   user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
   },
   products: {
      type: [productSchema],
      default: [] 
   }
});

var Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;