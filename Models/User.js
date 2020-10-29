var mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        maxlength: 100
    },
    lastName: {
        type: String,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    streetAddress: {
        type: String
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    token: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);