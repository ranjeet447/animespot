const express = require("express");
const path = require('path');
const router = express.Router();

const Anime = require('../db/models/anime');
const Episode = require('../db/models/episode');

router.get('/',(req,res)=>{
  Anime.find({},{name:1,},function(err,foundData){
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
  var name = req.params.name;
  Anime.find({name},function(err,foundAnime){
    console.log(foundAnime);
    if (err) {
      throw err;
    }else{
      Episode.find({anime:name},null,{sort:{'_id': -1}},function(err,foundEpisodes){
        console.log(foundEpisodes);
        if(err) throw err;
        else{
          res.render('anime',{anime:foundAnime,episodes:foundEpisodes});
        }
      });
    }
  });
});

router.get('/anime/play/:anime/:season/:episode',(req,res)=>{
  var name = req.params.anime;
  var season = req.params.season;
  var eNo=req.params.episode;
  Episode.findOne({anime:name,seasonNo:season,episodeNo:eNo},function(err,foundEpisode){
    console.log(foundEpisode);
    if(err) throw err;
    else{
      res.render('playAnime',{episode:foundEpisode});
    }
  });
});





// router.get("/*", function(req, res){
//     res.render("404");
// });

module.exports = router;
