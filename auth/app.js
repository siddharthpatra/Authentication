const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const partials = require('express-partials');
const session = require('express-session');

app.use(partials());


//DB connection
//mongoose.connect('mongodb://localhost/Authentication_db');
//mongoose.connection.once('open', function(){
  //  console.log('Connection Established to mongodb');
//});

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//Body parser
app.use(express.urlencoded({ extended: false}));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//routes
app.use('/', require('./route/index'));
app.use('/users', require('./route/users'));

const Port = process.env.Port || 5000;
app.listen(Port, console.log(`Server Started on port ${Port}`));