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
const Apis = require('./routes/api');



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
        expires: 60*60*1000
    }
}));

app.use(pagesRoutes);
app.use('/admin',adminRoutes);
app.use('/api',Apis);

// 6Lcy044UAAAAADC8Js9prdLvjr_6Xrg-apcZzqtQ  //SITE KEY
// 6Lcy044UAAAAAFHd7jNP8jzaFA4pd1SzQw_JRWJb  //SECRET KEY

app.get("/*", function(req, res){
    res.render("404");
});
app.get("/*/*", function(req, res){
    res.render("404");
});

var port = process.env.PORT || 3000;
app.listen(port,()=>{
  console.log(`sever up on port ${port}`)
});
