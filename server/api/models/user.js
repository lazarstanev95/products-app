const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: false },
    resetToken: { type: String, required: false } ,
    resetTokenExpiration: { type: Date, required: false },
    cart: {
        items: [
            {
                productId: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'Product', 
                    required: true 
            },
                quantity: { type: Number, required: true }
            }
        ]
    },
    likedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save()
}

userSchema.index({name: 'text', lastName: 'text', email: 'text'});
module.exports = mongoose.model('User', userSchema);