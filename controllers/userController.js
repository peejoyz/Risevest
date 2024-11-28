const express = require('express')
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel')
const Media = require('../models/userData')

exports.login = (req, res) => {
    res.render('users/login', {
        title: 'Login'
    })
}

// exports.postLogin = (req, res, next) => {
//     passport.authenticate('local', {
//         // successRedirect: '/user/upload',
//         // successReturnToOrRedirect: '/',
//         failureRedirect: '/user/login',
//         failureFlash: true
//     }), function (req, res, next){
//         if(req.session.oldUrl) {
//             console.log(req.session.oldUrl + 'new')
//             var oldUrl = req.session.oldUrl;
//             req.session.oldUrl = null;
//             res.redirect(oldUrl);
//         } else {
//             res.redirect('/')
//         }
//     }
// }

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        // successRedirect: '/user/profile',
        failureRedirect: '/user/login',
        failureFlash: true
    }), function (req, res, next) {
        // if(req.session.oldUrl) {
        //     console.log(req.session.oldUrl + 'new')
        //     var oldUrl = req.session.oldUrl;
        //     req.session.oldUrl = null;
        //     res.redirect(oldUrl);
        // } 
        if(req.session.oldUrl) {
            console.log(req.session.oldUrl + 'new')
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        }
        else {
            res.redirect('/')
        }
    }
    (req, res, next)
}

// exports.postLogin = () => {
//     passport.authenticate('local', {
//         failureRedirect: '/user/login',
//         failureFlash: true
//     }), function(req, res, next) {
//         if(req.session.oldUrl) {
//             // console.log(req.session.originalUrl + 'new')
//             var oldUrl = req.session.oldUrl;
//             req.session.oldUrl = null;
//             res.redirect(oldUrl);
//         } else {
//             res.redirect('/')
//         }
//     }
// } 

exports.getUserSignup = (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password

    res.render('users/signup', {
        title: 'Register',
        name: name,
        email: email
    })
}

exports.postSignup = async (req, res) => {
    let fullname = req.body.fullname;
    let email = req.body.email;
    let password = req.body.password;

    let user = await User.findOne({email: email})
    if(user) {
        // res.status(400).json({message: 'email already exists'})
        res.send('Email already exist')
        // res.redirect('/users/signup')
    } else {
        try {
            let user = new User({
                fullname: fullname,
                email: email,
                password: password
            })

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if(err) console.log(err)
                    user.password = hash;
                        
                    user.save().then((user) => {
                        console.log(user)
                    }).catch((err) => {
                        console.log(err)
                    });
                    res.status(200).json({message: 'Registered successfully'})
                    // res.redirect('/users/login')    
                })
            })
        } catch (err) {
            console.error(err)
        }
    }
}

// exports.upload = async (req, res) => {
//     const user = await User.findOne({_id: req.user.id})
//     if(req.user && req.user.role === 'user') {
//         res.render('users/upload', {
//             title: 'Upload a file',
//             message: '',
//             user: user
//         })
//     } else {
//         res.send('Unauthorized user')
//     }
// }

//Get Logout
exports.Logout = (req, res) => {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        req.flash('success', 'You are logged out');
        res.redirect('/user/login');
    });
}

// exports.postLogin = (req, res, next) => {
//     passport.authenticate('local', {
//         failureRedirect: '/user/login',
//         failureFlash: true
//     }), function (req, res, next) {
//         if(req.session.originalUrl) {
//             let originalUrl = req.session.originalUrl;
//             req.session.originalUrl = null;
//             res.redirect(originalUrl);
//         } else {
//             res.redirect('/user/upload')
//         }
//     }
// }

// exports.postUpload = (req, res) => {
//     try {
//         if(!req.files) {
//             req.flash('danger', 'Pls check the field and upload a file')
//             res.render('users/upload', {
//                 title: 'Upload a file',
//                 message: ''
//             })
//         } else {
//             let message = '';
//             let title = req.body.title;
//             let media = req.files.media;
//             let user = req.user.email;
//             let media_name = media.name;
//             media_name = media.name;
//             let maxFileSize = 200 * 1024 * 1024;

//             if(!media) {
//                 req.flash('danger', 'Pls check the field and upload a file')
//                 res.render('users/upload', {
//                     title: 'Upload a file',
//                     message: ''
//                 }) 
//             } else {
//                 if(media.mimetype === 'image/png' || media.mimetype === 'image/jpg' || media.mimetype === 'image/jpeg') {
//                     let fileName = Math.random().toString(10).slice(2) + '-' + new Date().getTime() + '-' + user + media_name;
//                     let pathdata = 'public/data/' + fileName;
//                     let pathMdata = '/data/' + fileName;

//                     let media2 = req.files.media;
//                     if(media2 > maxFileSize) {
//                         message = "File too large, file must not be greater than 200MB"
//                         res.render('users/upload', {
//                             title: 'Upload a file',
//                             message: ''
//                         }) 
//                     } else {
//                         media2.mv(pathdata, function(err) {
//                             if(err) {
//                                 res.status(500).json({message : err.message});
//                             }   
//                         })
//                     }
//                     let media = new Media({
//                         user: {
//                             _id: req.user.id
//                         },
//                         title: title,
//                         media:pathMdata,
//                         fileType: 'image'
//                     })

//                     media.save().then((media) => {
//                         // console.log(media)
//                     }).catch((err) => {
//                         console.log(err)
//                     })
//                     req.flash('success', 'Your file has been uploaded successfully.')
//                     res.redirect("/upload");

//                 //Audio files
//                 } else if(media.mimetype === 'audio/mpeg') {
//                     let fileName = Math.random().toString(10).slice(2) + '-' + new Date().getTime() + '-' + user + media_name;
//                     let pathdata = 'public/data/' + fileName;
//                     let pathMdata = '/data/' + fileName;

//                     let media3 = req.files.media;

//                     if(media3 > maxFileSize) {
//                         // console.log(media)
//                         message = "File too large, file must not be greater than 200MB"
//                         res.render('users/upload', {
//                             title: 'Upload a file',
//                             message: ''
//                         }) 
//                     } else {
//                         media3.mv(pathdata, function(err) {
//                             if(err) {
//                                 return res.status(500).json({message : err.message});
//                             }   
//                         })
//                     }
//                     let media = new Media({
//                         user: {
//                             _id: req.user.id
//                         },
//                         title: title,
//                         media:pathMdata,
//                         fileType: 'audio'
//                     })

//                     media.save().then((media) => {
//                         // console.log(media)
//                     }).catch((err) => {
//                         console.log(err)
//                     })
//                     req.flash('success', 'Your file has been uploaded successfully.')
//                     res.redirect("/upload");
//                 }
//                 else if(media.mimetype === 'video/mp4') {
//                     let fileName = Math.random().toString(10).slice(2) + '-' + new Date().getTime() + '-' + user + media_name;
//                     let pathdata = 'public/data/' + fileName;
//                     let pathMdata = '/data/' + fileName;

//                     let media4 = req.files.media;

//                     if(media4 > maxFileSize) {
//                         // console.log(media)
//                         message = "File too large, file must not be greater than 200MB"
//                         res.render('users/upload', {
//                             title: 'Upload a file',
//                             message: ''
//                         }) 
//                     } else {
//                         media4.mv(pathdata, function(err) {
//                             if(err) {
//                                 return res.status(500).json({message : err.message});
//                             }   
//                         })
//                     }
//                     let media = new Media({
//                         user: {
//                             _id: req.user.id
//                         },
//                         title: title,
//                         media:pathMdata,
//                         fileType: 'video'
//                     })

//                     media.save().then((media) => {
//                         // console.log(media)
//                     }).catch((err) => {
//                         console.log(err)
//                     })
//                     req.flash('success', 'Your file has been uploaded successfully.')
//                     res.redirect("/upload");
//                 }
//                 else {
//                     message = "Sorry you can only upload an img file, which is in jpg or png format. Video file, in mp4 format and an audio file"
//                     res.render('users/upload', {
//                         message,
//                         title: 'Upload a file'
//                     })
//                 }
//             }
//         }
//     } catch (err) {
//         console.log(err)
//     }
// }

