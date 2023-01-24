const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bayReceSchema = new Schema({
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

var Favorite = mongoose.model('bayRec', bayReceSchema);
module.exports = Favorite;