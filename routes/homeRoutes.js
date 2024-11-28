const router = require('express').Router()
const controller = require('../controllers/homeController')
const auth = require('../config/auth')

router
.get('/', controller.getHome)
.post('/download', auth.isUser, controller.download)
.get('/download', auth.isUser, controller.getDownload)
.get('/folder', auth.isUser, controller.createFolder)
.post('/folder', auth.isUser, controller.postFolder)
.post('/add/:_id', auth.isUser, controller.add)
.get('/folder/files', auth.isUser, controller.getFilesInFolder)
.get('/upload', auth.isUser, controller.upload)
.post('/upload', auth.isUser, controller.postUpload)

module.exports = router;
