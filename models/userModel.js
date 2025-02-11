const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    folder: {
        type: Array
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema);
