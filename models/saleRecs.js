const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleReceSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
   },
   products: {
      type: [Schema.Types.ObjectId],
      ref: 'product'
   }
}, {
   timestamps: true
});

var Favorite = mongoose.model('saleRec', saleReceSchema);
module.exports = Favorite;