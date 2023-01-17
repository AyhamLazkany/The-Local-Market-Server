const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
   storeId: {
      type: String,
      required: true
   },
   products: {
      type: [Schema.Types.ObjectId],
      ref: 'product'
   }
},{
   timestamps: true
});

module.exports = mongoose.model('favorite',favoriteSchema);