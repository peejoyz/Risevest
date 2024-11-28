const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
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
        default: 'admin'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Admin', adminSchema);
