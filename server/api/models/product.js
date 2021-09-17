const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: false },
    price: { type: Number, required: false },
    description: {type: String, required: false },
    productImage: { type: String, required: false },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      }
});

module.exports = mongoose.model('Product', productSchema);