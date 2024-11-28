const router = require('express').Router();
const passport = require('passport');
const controller = require('../../controllers/userController')
const auth = require('../../config/auth')

router.get('/register', controller.getUserSignup);
router.post('/register', controller.postSignup)
router.get('/logout', controller.Logout)
// router.get('/upload', auth.isUser, controller.upload)
// router.post('/upload', auth.isUser, controller.postUpload)
router.get('/login', controller.login)
router.post('/login', controller.postLogin)

// connectEnsureLogin.ensureLoggedIn({redirectTo: '/user/login'}),

module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.session.originalUrl = req.url;
    res.redirect('/');
}