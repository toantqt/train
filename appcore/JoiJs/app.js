const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose')
const passport = require('passport')
 
app.use(morgan("dev"));

//connect db
mongoose.connect('mongodb://localhost:27017/validation-JoiJS', {useNewUrlParser: true});
mongoose.connection.once("open", function() {
    console.log("Database Connection Established Successfully.");
  });

//views folder and setting ejs engine
app.set("views", path.resolve(__dirname, "./views"));
app.set("view engine", "ejs")

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'codeworkrsecret',
    saveUninitialized: false,
    resave: false
  }));

app.use(passport.initialize())
app.use(passport.session())

//flash mesages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_mesages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  next();
});

//route
const register = require('./routes/register');
app.use('/', register);

const login = require('./routes/login');
app.use('/', login)

const home = require('./routes/home');
app.use('/', home);


//catch 404
app.use((req, res, next) => {
    res.send('notFound')
  });

//start server
app.listen(port, () => {
    console.log('Server on port: ' +port);
});
