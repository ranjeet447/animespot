require("./db/db");

const express = require('express');
const path = require('path');
var compression = require('compression')
const ejs = require('ejs');
const mongoose = require('mongoose');
const flash = require("connect-flash");
const bodyParser = require('body-parser');
var session = require('express-session')
const pagesRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');



var app  = express();
app.use(express.static(path.resolve(__dirname + "/assets")));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compression());
app.set("view engine", "ejs");
app.disable('x-powered-by');
app.use(flash());

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 15*60*1000
    }
}));

app.use(pagesRoutes);
app.use('/admin',adminRoutes);


var port = 3000 || process.env.PORT;
app.listen(port,()=>{
  console.log(`sever up on port ${port}`)
});
