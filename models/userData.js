const mongoose = require('mongoose')
const DataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    folder: {
        type: String
    },
    fileType : {
        type: String
    },
    mark: {
        type: String,
        default: 'safe'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Data', DataSchema);
