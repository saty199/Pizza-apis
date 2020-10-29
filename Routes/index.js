const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth');

const { SignUp, SignIn, Logout, UpdateUser, DeleteUser } = require('../Controllers/UserControllers');
const { getAllProducts, createProduct, upload, uploadProductImage } = require('../Controllers/ProductController');



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
// router.post('/uploadimage', verifyToken, uploadProductImage)


module.exports = router;