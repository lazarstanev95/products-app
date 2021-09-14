const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: {type: String, required: true},
    productImage: { type: String, required: false },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      }
});

module.exports = mongoose.model('Product', productSchema);