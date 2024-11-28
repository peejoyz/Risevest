const router = require('express').Router()
const controller = require('../controllers/adminController')
const {isAdmin} = require('../config/auth')
const connectEnsureLogin = require('connect-ensure-login')

router
.get('/register', controller.getAdminSignup)
.post('/postAdmin', controller.postAdminSignup)
.get('/login', controller.login)
.post('/login', controller.postLogin)
.get('/index', connectEnsureLogin.ensureAuthenticated({redirectTo: '/admin/login'}), controller.getIndex)
.get('/logout', controller.Logout)
.post('/unsafe', isAdmin, controller.deleteUnsafe)

module.exports = router;