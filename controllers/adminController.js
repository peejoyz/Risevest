const express = require('express')
const passport = require('passport');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const Admin = require('../models/adminModel');
const Data = require('../models/userData')
const User = require('../models/userModel')
const Folder = require('../models/Folder');
const ObjectId = mongoose.Types.ObjectId;

exports.getAdminSignup = (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password

    res.render('admin/signup', {
        title: 'Register',
        name: name,
        email: email,
        password: password
    })
}

exports.postAdminSignup = async (req, res) => {
    let fullname = req.body.fullname;
    let email = req.body.email;
    let password = req.body.password;

    let admin = await Admin.findOne({email: email})
    if(admin) {
        // res.status(301).json({message: 'Email already exists'})
        res.send('Email already exist')
        // res.redirect('/admin/signup')
    } else {
        try {
            let admin = new Admin({
                fullname: fullname,
                email: email,
                password: password
            })

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(admin.password, salt, function(err, hash) {
                    if(err) console.log(err)
                    admin.password = hash;
                        
                    admin.save().then((admin) => {
                        console.log(admin)
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

//Admin - Login Page
exports.login = (req, res) => {
    res.render('admin/login', {
        title: 'Login'
    })
}

//Admin - Post Login
exports.postLogin = (req, res, next) => {
    passport.authenticate('local.admin', {
        // successRedirect: '/admin/index',
        successReturnToOrRedirect: '/',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next) 
}

exports.getIndex = async (req, res) => {
    try {
        const datas = await Data.find()
        .populate('user')
        const folders = await Folder.find()
        res.render('admin/index', {
            title: 'Index',
            datas: datas,
            folders: folders
        })
    } catch (err) {
        console.log(err)
    }
}

//Get Logout
exports.Logout = (req, res) => {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        req.flash('success', 'You are logged out');
        res.redirect('/admin/login');
    });
}

//deleting unsafe files
exports.deleteUnsafe = async (req, res) => {
    try {
        let id = req.params.id;
        let dataId = req.body.dataId;
        let mark = req.body.mark;
        // console.log(dataId, title, mediaOwner, media, mark)
        // const data = await Data.findById(dataId)
        
        if(mark == 'unsafe'){
            Data.updateOne({
                "_id": dataId
            }, {
                $set: {
                    "mark": mark 
                }}, {new: true}
            ).then((response) => {
                // res.status(200).send()
                // console.log(response)
            }).catch((err) => {
                console.log(err.message)
            })
            .then((data) => {
                Data.deleteOne({
                    "_id": dataId
                }).exec()
            })

            req.flash('success', 'Changes saved successfully.');
            res.redirect('/admin/index');
        } else if(mark == 'safe') {
            Data.updateOne({
                "_id": dataId
            }, {
                $set: {
                    "mark": mark 
                }}, {new: true}
            ).then((response) => {
                // res.status(200).send()
                req.flash('success', 'Changes saved successfully');
                res.redirect('/admin/index');
                // console.log(response)
            }).catch((err) => {
                console.log(err.message)
            })
        }
        // console.log(data)
    } catch (err) {
        console.log(err)
    }
}

