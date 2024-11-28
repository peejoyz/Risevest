if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const passport = require('passport')
const MongoStore = require('connect-mongo');
// const connectMongo = require('connect-mongo');
const fileUpload = require('express-fileupload');

const app = express()

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
}

//express-fileupload
app.use(fileUpload());

//passport config
require('./config/passport')

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//set global errors variable
app.locals.errors = null;

//bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser("cookie-parser-secret"));

// const MongoStore = connectMongo(session);

// new MongoStore(session)

//Express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // store: new MongoStore({
  //   mongoUrl: process.env.MONGO_URI,
  //   ttl: 14 * 24 * 60 * 60,
  //   autoRemove: 'native'
  // })
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      // ttl: 14 * 24 * 60 * 60,
      // touchAfter: process.env.touchAfter
  }), 
  cookie: {
    maxAge: 180 * 60 * 1000,
  }
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//set global var : for user
app.use(function(req, res, next) {
  res.locals.user = req.user || null;
  res.locals.session = req.session;
  next()
})

// Express Messages middleware : NB: you need to install connect-flash too
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use('/user', require('./routes/user/userRoutes'))
app.use('/admin', require('./routes/adminRoutes'))
app.use('/', require('./routes/homeRoutes'))

const port = process.env.PORT || 4000

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Running in ${process.env.NODE_ENV} mode on port ${port}`)
    })
})

module.exports = app;


