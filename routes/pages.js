const express = require("express");
const path = require('path');
const router = express.Router();
const https = require('https');

const Anime = require('../db/models/anime');
const Episode = require('../db/models/episode');

const encrypt = require('../utils/encryption').encrypt;
const decrypt = require('../utils/encryption').decrypt;

router.get('/',(req,res)=>{
  Anime.find({},{name:1,image:1,ongoing:1},function(err,foundData){
    if (err) {
      throw err;
    }else{
        res.render('index',{animeList:foundData,genre:''});
        // console.log(foundData);
    }
  });
  // res.render('index');
});
router.get('/latest',(req,res)=>{
  Anime.find({},{name:1,image:1,ongoing:1},{$sort:{_id:-1}},function(err,foundData){
    if (err) {
      throw err;
    }else{
        res.render('index',{animeList:foundData,genre:'Latest Anime'});
        // console.log(foundData);
    }
  });
  // res.render('index');
});
router.get('/genre/:genre',(req,res)=>{
  let genre=req.params.genre;
  genreRegex=new RegExp(genre,'ig')
  Anime.find({genre:genreRegex},{name:1,image:1,ongoing:1,genre:1},function(err,foundData){
    if (err) {
      throw err;
    }else{
        res.render('index',{animeList:foundData,genre});
        // console.log(foundData);
    }
  });
  // res.render('index');
});

router.get('/anime/:name',(req,res)=>{
  let name = req.params.name.trim().replace(/-/g,' ');
  Anime.findOne({name},{},{lean:true},function(err,foundAnime){
    let anime = foundAnime?foundAnime:{name:`${name} : No data Found`}
    // console.log(anime)
    if (err) {
      throw err;
    }else{
      Episode.aggregate([
        {$match:{anime:name}},
        {$project:{anime:1,seasonNo:1,episodeNo:1,name:1,vid:1}},
        {
          $group:{
            _id:"$seasonNo",
            episodes:{
              $push: "$$ROOT" 
          },
            count: { $sum:1 }
          }
        },
        {
          $project:{
            season:"$_id",
            count:"$count",
            episodes:"$episodes",
          }
        },
        {$sort:{season:-1}},
      ]).then(seasons=>{
        res.render('anime',{anime,seasons,encrypt});
      })
    }
  });
});
router.get('/search/anime',(req,res)=>{
  let name = req.query.name.trim();
Anime.findOne({name},function(err,foundAnime){
    let anime = foundAnime?foundAnime:{name:`${name} : No data Found`}
    if (err) {
      throw err;
    }else{
      Episode.aggregate([
        {$match:{anime:name}},
        {$project:{anime:1,seasonNo:1,episodeNo:1,name:1,vid:1}},
        {
          $group:{
            _id:"$seasonNo",
            episodes:{
              $push: "$$ROOT"
          },
            count: { $sum:1 }
          }
        },
        {
          $project:{
            season:"$_id",
            count:"$count",
            episodes:"$episodes",
          }
        },
        {$sort:{season:-1}},
      ]).then(seasons=>{
        res.render('anime',{anime,seasons,encrypt});
      })
    }
  });
});

// let SECRET = "6Lcy044UAAAAAFHd7jNP8jzaFA4pd1SzQw_JRWJb";
// Helper function to make API call to recatpcha and check response
// function verifyRecaptcha(key, callback) {
//   https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
//       let data = "";
//       res.on('data', function (chunk) {
//             data += chunk.toString();
//       });
//       res.on('end', function() {
//           try {
//                   let parsedData = JSON.parse(data);
//                   console.log(parsedData);
//                   callback(parsedData.success);
//           } catch (e) {
//                   callback(false);
//           }
//       });
//   });
// }
router.get('/anime/play/:anime/:season/:episode',async (req,res)=>{
  let name = req.params.anime.trim().replace(/-/g,' ');
  let season = decrypt(req.params.season.trim().replace(/-/g,' '));
  let eNo = decrypt(req.params.episode.trim().replace(/-/g,' '));
  let episodes= await Episode.find({anime:name,seasonNo:season},{name:1,seasonNo:1,episodeNo:1})
  Episode.findOne({anime:name,seasonNo:season,episodeNo:eNo},function(err,foundEpisode){
    // console.log(foundEpisode);
    if(err) throw err;
    else{
      res.render('playAnime',{episode:foundEpisode,episodes,encrypt});
    }
  });
  // verifyRecaptcha(req.body["recaptcha"], function(success) {
  //     if (success) {
  //
  //     } else {
  //       res.redirect(`/`)
  //     }
  // });
});
router.get("/bug-report", function(req, res){
  res.render("bugReport");
});
router.get("/demo", function(req, res){
    res.render("demo");
});
router.get("/recaptcha", function(req, res){
    res.render("recaptcha");
});
module.exports = router;
