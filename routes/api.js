const express = require("express");
const path = require('path');
const router = express.Router();
const https = require('https');

const Anime = require('../db/models/anime');
const Episode = require('../db/models/episode');

router.get('/anime-list',(req,res)=>{
    Anime.find({},{name:1}).then(anime=>{
        res.status(200).json({anime});
    }).catch(err=>{
        console.log(err)
        res.status(500).json({msg:err.msg});
    });
})

module.exports = router;