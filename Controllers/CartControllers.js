const Cart = require('../Models/Cart');
const Product = require('../Models/Product');
const Order = require('../Models/Order');
const mailgun = require("mailgun-js");
const config = require('../config');
const mg = mailgun({ apiKey: config.MAILGUN_APIKEY, domain: config.MAILGUN_DOMAIN });

const AddItemToCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });
        const { productId, quantity } = req.body;
        let productDetails = await Product.findById({ _id: productId });
        if (!productDetails) {
            return res.status(404).send({ message: "Product not found!" });
        }
        if (cart) {
            const indexFound = cart.items.findIndex(item => item.productId.id == productId);
            if (indexFound !== -1 && quantity <= 0) {
                cart.items.splice(indexFound, 1);
                if (cart.items.length == 0) {
                    cart.subTotal = 0;
                } else {
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
            }
            else if (indexFound !== -1) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
                cart.items[indexFound].price = productDetails.price
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                cart.userId = req.user._id
            }
            else if (quantity > 0) {
                cart.items.push({
                    productId: productId,
                    quantity: quantity,
                    price: productDetails.price,
                    total: parseInt(productDetails.price * quantity)
                })
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                cart.userId = req.user._id
            }
            else {
                return res.status(400).send({ message: "Invalid request" })
            }
            let data = await cart.save();
            res.status(200).send({ message: "Process Successful", data })
        } else {
            const cartData = {
                items: [{
                    productId: productId,
                    quantity: quantity,
                    total: parseInt(productDetails.price * quantity),
                    price: productDetails.price
                }],
                subTotal: parseInt(productDetails.price * quantity),
                userId: req.user._id
            }
            cart = await Cart.create(cartData)
            res.status(200).send({ message: "Process Successful", data: cart })
        }
    } catch (error) {
        console.log({ error })
        res.status(500).send({ message: "Something went wrong", error })
    }
}

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).send({ message: "cart not found!" });
        } else {
            return res.status(200).send({ message: "Cart details", data: cart });
        }
    } catch (error) {
        console.log({ error })
        res.status(500).send({ message: "Something went wrong", error })
    }
}

const EmptyCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).send({ message: "cart not found!" });
        } else {
            cart.items = [];
            cart.subTotal = 0
            let data = await cart.save();
            return res.status(200).send({ message: "Cart empty successfully", data });
        }
    } catch (error) {
        console.log({ error })
        res.status(500).send({ message: "Something went wrong", error })
    }
}

const Checkout = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).send({ message: "cart not found!" });
        }
        if (cart.items.length == 0) {
            return res.status(404).send({ message: "cart is empty!" });
        }
        let params = {
            items: cart.items,
            subTotal: cart.subTotal,
            userId: req.user._id,
            createdAt: Date.now().toString()
        }
        let order = await Order.create(params);
        cart.items = [];
        cart.subTotal = 0
        await cart.save();
        if (order) {
            await sendEmail(req.user.email);
            return res.status(200).send({ message: "Order successfully placed", data: order })

        } else {
            return res.status(400).send({ message: "Something went wrong" })
        }
    } catch (error) {
        console.log({ error })
        res.status(500).send({ message: "Something went wrong", error })
    }
}

const sendEmail = async (email) => new Promise((resolve, reject) => {
    const data = {
        from: "Mailgun Sandbox <postmaster@sandbox7f62d4673bc94bb7837a8ece1944b200.mailgun.org>",
        to: email,
        subject: "Order Receipt",
        text: "You got this email as receipt of your current order"
    };
    mg.messages().send(data, function (error, body) {
        if (error) reject(error);
        else resolve(body)
    });
})

const getAllOrder = async (req, res) => {
    try {
        let order = await Order.find();
        if (order.length > 0) {
            return res.status(200).send({ message: "Order fetched", data: order });
        } else {
            return res.status(404).send({ message: "No Order found!" });
        }
    } catch (error) {
        console.log({ error })
        res.status(500).send({ message: "Something went wrong", error })
    }
}

module.exports = { AddItemToCart, getCart, EmptyCart, Checkout, getAllOrder }