const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please include the product name"],
        unique: 1
    },
    price: {
        type: String,
        required: [true, "Please include the product price"],
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
});

module.exports = mongoose.model("Product", productSchema);
