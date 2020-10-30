const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth');

const { SignUp, SignIn, Logout, UpdateUser, DeleteUser } = require('../Controllers/UserControllers');
const { getAllProducts, createProduct, upload } = require('../Controllers/ProductController');
const { AddItemToCart, getCart, EmptyCart, Checkout , getAllOrder} = require('../Controllers/CartControllers');



// ██╗   ██╗███████╗███████╗██████╗     ██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
// ██║   ██║██╔════╝██╔════╝██╔══██╗    ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
// ██║   ██║███████╗█████╗  ██████╔╝    ██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
// ██║   ██║╚════██║██╔══╝  ██╔══██╗    ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
// ╚██████╔╝███████║███████╗██║  ██║    ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
//  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
//                                                                                         

router.post('/signUp', SignUp);
router.post('/signIn', SignIn);
router.get('/logout', verifyToken, Logout)
router.put('/updateUser', verifyToken, UpdateUser)
router.delete('/deleteUser', verifyToken, DeleteUser)


// ██████╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗ ██████╗████████╗    ██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
// ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██║   ██║██╔════╝╚══██╔══╝    ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
// ██████╔╝██████╔╝██║   ██║██║  ██║██║   ██║██║        ██║       ██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
// ██╔═══╝ ██╔══██╗██║   ██║██║  ██║██║   ██║██║        ██║       ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
// ██║     ██║  ██║╚██████╔╝██████╔╝╚██████╔╝╚██████╗   ██║       ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
// ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝  ╚═════╝   ╚═╝       ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
//                                                                                                                   


router.get('/getAllProducts', verifyToken, getAllProducts)
router.post('/createProduct', verifyToken, upload.single('image'), createProduct)



//  ██████╗ █████╗ ██████╗ ████████╗    ██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
// ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝    ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
// ██║     ███████║██████╔╝   ██║       ██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
// ██║     ██╔══██║██╔══██╗   ██║       ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
// ╚██████╗██║  ██║██║  ██║   ██║       ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
//  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
//                                                                                         

router.post('/AddItemToCart', verifyToken, AddItemToCart)
router.get('/getCart', verifyToken, getCart);
router.delete('/EmptyCart', verifyToken, EmptyCart);
router.post('/Checkout', verifyToken, Checkout)

router.get('/getAllOrder', verifyToken, getAllOrder);

module.exports = router;