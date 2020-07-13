const express = require("express");
const path = require('path');
const router = express.Router();
const https = require('https');

const Anime = require('../db/models/anime');
const Episode = require('../db/models/episode');

router.get('/',(req,res)=>{
  Anime.find({},{name:1,image:1,ongoing:1},function(err,foundData){
    if (err) {
      throw err;
    }else{
        res.render('index',{animeList:foundData});
        // console.log(foundData);
    }
  });
  // res.render('index');
});

router.get('/anime/:name',(req,res)=>{
  let name = req.params.name.trim().replace(/-/g,' ');
  Anime.findOne({name},function(err,foundAnime){
    let anime = foundAnime?foundAnime.name:`${name} : No data Found`
    if (err) {
      throw err;
    }else{
      Episode.find({anime:name},null,{sort:{'_id': -1}},function(err,foundEpisodes){
        // console.log(foundEpisodes);
        if(err) throw err;
        else{
          res.render('anime',{anime,episodes:foundEpisodes});
        }
      });
    }
  });
});
router.get('/search/anime',(req,res)=>{
  let name = req.query.name.trim();

  Anime.findOne({name},function(err,foundAnime){
    let anime = foundAnime?foundAnime.name:`${name} : No data Found`
    if (err) {
      throw err;
    }else{
      Episode.find({anime:name},null,{sort:{'_id': -1}},function(err,foundEpisodes){
        // console.log(foundEpisodes);
        if(err) throw err;
        else{
          res.render('anime',{anime,episodes:foundEpisodes});
        }
      });
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
router.get('/anime/play/:anime/:season/:episode',(req,res)=>{
  let name = req.params.anime.trim().replace(/-/g,' ');
  let season = req.params.season.trim().replace(/-/g,' ');
  let eNo=req.params.episode.trim().replace(/-/g,' ');

  Episode.findOne({anime:name,seasonNo:season,episodeNo:eNo},function(err,foundEpisode){
    // console.log(foundEpisode);
    if(err) throw err;
    else{
      res.render('playAnime',{episode:foundEpisode});
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
router.get("/demo", function(req, res){
    res.render("demo");
});
router.get("/recaptcha", function(req, res){
    res.render("recaptcha");
});
module.exports = router;
