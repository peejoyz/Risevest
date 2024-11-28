exports.isUser = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    else {
        req.session.oldUrl = req.originalUrl;
        console.log(req.session.oldUrl)
        req.flash('danger', 'Pls login')
        res.redirect('/user/login');
    }
}

//admin
exports.isAdmin = function(req, res, next) {
    if(req.isAuthenticated() && res.locals.user.role == 'admin') {
        return next();
    } else {
        // req.session.originalUrl = req.url; //for redirecting.
        req.flash('danger', 'Please log in as admin.');
        res.redirect('/admin/login');
    }
}