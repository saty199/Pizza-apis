const User = require('../Models/User');
const config = require('../config');
const bcrypt = require('bcrypt');
const Auth = require('../auth');

const SignUp = async (req, res) => {
    try {
        const { email, password, firstName, lastName, streetAddress } = req.body;
        if (!email || !password) {
            return res.status(404).send({ message: "Email/password is required" });
        }
        if (password.length < 8) {
            return res.status(400).send({ message: "Password length should be minimum 8" });
        }
        let checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(422).send({ message: "User already exist" });
        }
        let salt = await bcrypt.genSalt(config.SALT_ROUND);
        let encrypt = await bcrypt.hash(password, salt);
        let params = { email, password: encrypt, firstName, lastName, streetAddress, createdAt: Date.now().toString() };
        let createUser = await User.create(params);
        if (createUser) {
            return res.status(200).send({ message: "User signedUp successfully" });
        } else {
            return res.status(400).send({ message: "Something went wrong" });
        }
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error })
    }
};

const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({ message: "Email/password is required" });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not exist" });
        }
        let match = await bcrypt.compare(password, user.password);
        if (match == false || match == 'false') {
            return res.status(401).send({ message: "Password is incorrect" })
        }
        let token = await Auth.assignToken(user._id);
        let update = await User.updateOne({ email }, { $set: { token } });
        if (update) {
            return res.cookie('auth', token).send({ message: "SignedIn successfully", isAuth: true, token })
        } else {
            return res.status(400).send({ message: "Something went wrong" })
        }
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error })
    }
}

const Logout = async (req, res) => {
    try {
        let update = await User.updateOne({ _id: req.user._id }, { $unset: { token: 1 } }, { new: true });
        if (update) {
            return res.status(200).send({ message: "Successfully loged out" })
        }
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error })
    }
}

const UpdateUser = async (req, res) => {
    try {
        const { email, firstName, lastName, streetAddress } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not exist" });
        }
        let params = {
            email,
            password: user.password,
            firstName: firstName ? firstName : user.firstName,
            lastName: lastName ? lastName : user.lastName,
            streetAddress: streetAddress ? streetAddress : user.streetAddress,
        };
        let update = await User.findByIdAndUpdate({ _id: req.user._id }, { $set: params }, { new: true });
        if (update) {
            return res.status(200).send({ message: "User updated successfully", result: update })
        } else {
            res.status(400).send({ message: "Something went wrong" })
        }
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error })
    }
}

const DeleteUser = async (req, res) => {
    try {
        const { email } = req.user;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not exist" });
        }
        let deleteUser = await User.deleteOne({ email });
        if (deleteUser) {
            return res.status(200).send({ message: "User updated successfully", result: deleteUser })
        } else {
            return res.status(400).send({ message: "Something went wrong" })
        }
    } catch (error) {
        res.status(500).send({ message: "Something went wrong", error })
    }
}

module.exports = { SignUp, SignIn, Logout, UpdateUser, DeleteUser }