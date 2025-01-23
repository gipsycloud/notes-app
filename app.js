require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

// middle
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  static files;
app.use(express.static('public'));

// template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//route
app.use('/', require('./routes/index'));

var ProgressBar = require('./config/progressbar');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});