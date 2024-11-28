const express = require('express')
const mongoose = require('mongoose');
const Data = require('../models/userData');
const Download = require('../models/Downloads');
const Folder = require('../models/Folder');
const User = require('../models/userModel');
const ObjectId = mongoose.Types.ObjectId;

exports.getHome = async (req, res) => {
    // let id = req.params._id
    try {
        const datas = await Data.find({mark: 'safe'})
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean()
        const folders = await Folder.find({user: req.user})
        const user = await User.find({user: req.user})

        res.render('users/index', {
            title: 'Home',
            datas,
            folders,
            user: user
        }) 
    } catch (err) {
       console.log(err) 
    }
}

exports.download = async (req, res) => {
    try {
        let title = req.body.title;
        let mediaOwner = req.body.mediaOwner;
        let media = req.body.media;
        // console.log(title, user, image)
        const alreadyDownloaded = await Download.findOne({title: title})
        if(alreadyDownloaded) {
            res.send('Already downloaded file')
        } else {
            let download = new Download({
                title: title,
                mediaOwner: mediaOwner,
                user: {
                    _id: req.user.id
                },
                media: media
            })
    
            download.save().then((download) => {
                // console.log(download)
            }).catch((err) => {
                console.log(err)
            })
            req.flash('success', 'Downloaded successfully.')
            res.redirect("/");
        }
        
    } catch (err) {
       console.log(err) 
    }
}

exports.getDownload = async(req, res) => {
    try {
        const media = await Download.find({user: req.user})
        .populate('user')
        res.render('users/downloads', {
            title: 'Your downloaded files',
            media: media
        })
    } catch (err) {
        console.log(err)
    }
}

exports.createFolder = (req, res) => {
    res.render('users/folder', {
        title: 'Create a folder'
    })
}

exports.postFolder = async (req, res) => {
    try {
        let title = req.body.title;
        let desc = req.body.desc;

        // const folderName = await Folder.findOne({title: title})
        // if(folderName){
        //     req.flash('danger', 'Name of folder already exists, choose another')
        //     res.redirect('/folder')
        // } 
        // else {
            let folder = new Folder({
                title: title,
                desc: desc,
                user: {
                    _id: req.user.id
                }
            })

            folder.save().then((folder) => {
                // console.log(folder)
            }).catch((err) => {
                console.log(err)
            })

            User.updateOne({
                "_id": req.user.id
            }, {
                $push: {
                    "folder": {
                        // _id: new ObjectId(),
                        title: req.body.title,
                        medias: []
                    }
                }
            }).exec()

            req.flash('success', 'Folder created successfully.')
            res.redirect("/");
        // }
    } catch (err) {
        res.send(err)
    }
}

//add a media file to a folder
exports.add = async (req, res) => {
    try {
        // let id = req.body.dataId;
        let id = req.params._id
        let mediaId = req.body.mediaId
        let folderName = req.body.folderName;
        let folderId = req.body.folderId
        let title = req.body.title;
        let media = req.body.media
        
        // const fileIsPresent = Folder.findOne({media: mediaId})
        // // console.log(fileIsPresent)
        // if(fileIsPresent){
        //     req.flash('danger', 'File already exists in the folder')
        //     res.redirect('/')
        // } 
        
        // else {
            User.findOneAndUpdate({
                $and: [{
                    "_id": req.user.id
                }, {
                    "folder.title": folderName
                }] 
            }, {
                $push: {
                    "folder.$.medias": {
                        mediaId: new ObjectId(id),
                        title: title,
                        media: media
                    }
                }
            }
            ).then((response) => {
            }).catch((err) => {
                console.log(err.message)
            })

            //Adding to folder model
            Folder.updateOne({
                $and: [{
                    user: req.user.id,
                }, {
                    "title": folderName
                }]
            }, {
                $push: {
                    media: {
                        mediaId: new ObjectId(id),
                        title: title,
                        media: media
                    }
                }
            }
            ).then((response) => {
            }).catch((err) => {
                console.log(err)
            });
            
            //Adding to data model
            Data.updateOne({
                $and: [{
                    user: req.user
                }, {
                    "_id": id
                }]
            }, {
                $set: {
                    "folder": folderName
                }}, {new: true}
            ).then((response) => {
            }).catch((err) => {
                console.log(err)
            });

            req.flash('success', 'File has been added.')
            res.redirect("/");   
        // }

    } catch (err) {
        console.log(err)
    }
}

exports.getFilesInFolder = async (req, res) => {
    try {
        const userId = req.user.id
        const files = await User.findOne({_id: userId})
        res.render('users/folderFiles', {
            files: files,
            title: 'Your folder'
        })
        // console.log(files.folder)
    } catch (err) {
        console.log(err)
    }
}

exports.upload = async (req, res) => {
    const user = await User.findOne({_id: req.user.id})
    if(req.user && req.user.role === 'user') {
        res.render('users/upload', {
            title: 'Upload a file',
            message: '',
            user: user
        })
    } else {
        res.send('Unauthorized user')
    }
}

exports.postUpload = (req, res) => {
    try {
        if(!req.files) {
            req.flash('danger', 'Pls check the field and upload a file')
            res.render('users/upload', {
                title: 'Upload a file',
                message: ''
            })
        } else {
            let message = '';
            let title = req.body.title;
            let media = req.files.media;
            let user = req.user.email;
            let media_name = media.name;
            media_name = media.name;
            let maxFileSize = 200 * 1024 * 1024;

            if(!media) {
                req.flash('danger', 'Pls check the field and upload a file')
                res.render('users/upload', {
                    title: 'Upload a file',
                    message: ''
                }) 
            } else {
                if(media.mimetype === 'image/png' || media.mimetype === 'image/jpg' || media.mimetype === 'image/jpeg') {
                    let fileName = Math.random().toString(10).slice(2) + '-' + new Date().getTime() + '-' + user + media_name;
                    let pathdata = 'public/data/' + fileName;
                    let pathMdata = '/data/' + fileName;

                    let media2 = req.files.media;
                    if(media2 > maxFileSize) {
                        message = "File too large, file must not be greater than 200MB"
                        res.render('users/upload', {
                            message: '',
                            title: 'Upload a file',
                        }) 
                    } else {
                        media2.mv(pathdata, function(err) {
                            if(err) {
                                res.status(500).json({message : err.message});
                            }   
                        })
                    }
                    let media = new Media({
                        user: {
                            _id: req.user.id
                        },
                        title: title,
                        media:pathMdata,
                        fileType: 'image'
                    })

                    media.save().then((media) => {
                        // console.log(media)
                    }).catch((err) => {
                        console.log(err)
                    })
                    req.flash('success', 'Your file has been uploaded successfully.')
                    res.redirect("/upload");

                //Audio files
                } else if(media.mimetype === 'audio/mpeg') {
                    let fileName = Math.random().toString(10).slice(2) + '-' + new Date().getTime() + '-' + user + media_name;
                    let pathdata = 'public/data/' + fileName;
                    let pathMdata = '/data/' + fileName;

                    let media3 = req.files.media;

                    if(media3 > maxFileSize) {
                        // console.log(media)
                        message = "File too large, file must not be greater than 200MB"
                        res.render('users/upload', {
                            title: 'Upload a file',
                            message: ''
                        }) 
                    } else {
                        media3.mv(pathdata, function(err) {
                            if(err) {
                                return res.status(500).json({message : err.message});
                            }   
                        })
                    }
                    let media = new Media({
                        user: {
                            _id: req.user.id
                        },
                        title: title,
                        media:pathMdata,
                        fileType: 'audio'
                    })

                    media.save().then((media) => {
                        // console.log(media)
                    }).catch((err) => {
                        console.log(err)
                    })
                    req.flash('success', 'Your file has been uploaded successfully.')
                    res.redirect("/upload");
                }
                else if(media.mimetype === 'video/mp4') {
                    let fileName = Math.random().toString(10).slice(2) + '-' + new Date().getTime() + '-' + user + media_name;
                    let pathdata = 'public/data/' + fileName;
                    let pathMdata = '/data/' + fileName;

                    let media4 = req.files.media;

                    if(media4 > maxFileSize) {
                        // console.log(media)
                        message = "File too large, file must not be greater than 200MB"
                        res.render('users/upload', {
                            title: 'Upload a file',
                            message: ''
                        }) 
                    } else {
                        media4.mv(pathdata, function(err) {
                            if(err) {
                                return res.status(500).json({message : err.message});
                            }   
                        })
                    }
                    let media = new Media({
                        user: {
                            _id: req.user.id
                        },
                        title: title,
                        media:pathMdata,
                        fileType: 'video'
                    })

                    media.save().then((media) => {
                        // console.log(media)
                    }).catch((err) => {
                        console.log(err)
                    })
                    req.flash('success', 'Your file has been uploaded successfully.')
                    res.redirect("/upload");
                }
                else {
                    message = "Sorry you can only upload an img file, which is in jpg or png format. Video file, in mp4 format and an audio file"
                    res.render('users/upload', {
                        message,
                        title: 'Upload a file'
                    })
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}