const mongoose = require('mongoose')
const FolderSchema = new mongoose.Schema({
    title: {
        type: String
    },
    desc: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    media: {
        type: Array
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Folder', FolderSchema);
