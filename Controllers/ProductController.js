const config = require('../config');
const Product = require('../Models/Product');
const multer = require('multer');
const path = require('path');

const getAllProducts = async (req, res) => {
    try {
        let products = await Product.find();
        if (products.length > 0) {
            return res.status(200).send({ message: "All Products", data: products });
        } else {
            return res.status(404).send({ message: "No Product found" })
        }
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error })
    }
}

const createProduct = async (req, res) => {
    try {
        let { name, price } = req.body;
        if (!name || !price) {
            return res.status(404).send({ message: "Product name & price is required" });
        }
        let check = await Product.findOne({ name });
        if (check) {
            return res.status(422).send({ message: "Product already exist" });
        }
        let params = { name, price, image: req.file.path, createdAt: Date.now().toString() };
        let product = await Product.create(params);
        if (product) {
            return res.status(200).send({ message: "Product created successfully", data: product });
        } else {
            return res.status(400).send({ message: "Something went wrong" });
        }
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error })
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = { getAllProducts, upload, createProduct }