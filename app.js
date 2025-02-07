require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collection: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// connect to db
const connectDB = require('./server/db');
connectDB();

// middle
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

//  static files;
app.use(express.static('public'));

// Set 'views' directory for any views  
// being rendered res.render() 
app.set('views', path.join(__dirname, 'views'));

// template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//route
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/dashboard'));

app.get('*', (req, res) => {
  res.status(404).render('404');
});

// progress bar setup
var ProgressBar = require('./config/progressbar');

app.listen(port, () => {
  // console.log(`Server is running on port ${port}`);
  console.log(`Server is running on port ${port}` + ' in ' + app.get('env') + ' mode')
});