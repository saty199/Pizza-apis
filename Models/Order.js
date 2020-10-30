const mongoose = require('mongoose');

let ItemSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.']
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true,
    }
});

const OrderSchema = mongoose.Schema({
    items: [ItemSchema],
    subTotal: {
        default: 0,
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
})
module.exports = mongoose.model('OrderHistory', OrderSchema);