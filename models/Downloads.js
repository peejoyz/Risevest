const mongoose = require('mongoose')
const DownloadSchema = new mongoose.Schema({
    title: {
        type: String
    },
    media: {
        type: String
    },
    mediaOwner: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Download', DownloadSchema);
