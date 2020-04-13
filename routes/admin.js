//admin Routes
const express = require("express");
const path = require('path');
const router = express.Router();

const Anime = require('../db/models/anime');
const Episode = require('../db/models/episode');

var ap = process.env.ADMIN || "5";

function isAdmin(req,res,next) {
  if(req.session.admin){
    next();
  }else{
    res.redirect('/admin')
  }
}

router.get('/',(req,res)=>{
  res.render('admin');
});
router.post('/admin', function(req,res){
  console.log(req.body);
  var pass = req.body.password
  var sess=req.session;
  // console.log(pass,sess);
  if(pass === ap){
    sess.admin=true;
    res.redirect('/admin/addAnime')
  }
  else{
    sess.admin=false;
    res.redirect('/admin')
  }
});

router.get('/addAnime',isAdmin,(req,res)=>{
  Anime.find({},{name:1,},function(err,foundData){
    if (err) {
      throw err;
    }else{
        res.render('addAnime',{data:foundData});
        // console.log(foundData);
    }
  });
});

router.post('/addAnime',isAdmin,(req,res)=>{
  console.log(req.body);
  var anime =new Anime({
    name:req.body.name,
    description:req.body.description,
    genre:req.body.genre,
    ongoing:req.body.ongoing
  });
  anime.save(function(err,animeSaved){
    if(err) throw err;
    else{
      res.redirect('/admin/addAnime');
    }
  });
});

router.get('/addS/:anime',isAdmin,(req,res)=>{
  var name = req.params.anime;
  Anime.find({name},function(err,foundData){
    if (err) {
      throw err;
    }else{
      console.log(foundData);
        res.render('addS',{data:foundData});
    }
  });
});

router.post('/addSeason/:anime',isAdmin,(req,res)=>{
  anime=req.params.anime;
  var season={
    number:req.body.number,
    name:req.body.name
  }
  console.log("sss",season);
  Anime.updateOne({name:anime},{$push:{seasons:season}},{ new: true },function(err,found){
    if (err) {
      throw err;
    }else{
        res.redirect(`/admin/addS/${anime}`);
    }
  });
});

router.get('/addEp/:anime/:sno/:sname',isAdmin,(req,res)=>{
  var anime={
    name:req.params.anime,
    sno:req.params.sno,
    sname:req.params.sname
  }
  Episode.find({anime:req.params.anime,seasonNo:req.params.sno},null,{sort:{'_id': -1}},function(err,found){
    // console.log(found);
    if(err) throw err;
    else{
      res.render('addEpisode',{anime:anime,episodes:found});
    }
  });
});

router.post('/addEp/:anime/:sno/:sname',isAdmin,(req,res)=>{
  var anime=req.params.anime;
  var seasonNo=req.params.sno;
  var seasonName=req.params.sname;
  var episode = new Episode({
    anime:anime,
    seasonNo:seasonNo,
    episodeNo:req.body.number,
    name:req.body.name,
    vid:req.body.vid
  });

  episode.save(function(err,episodeSaved){
    if(err) throw err;
    else{
      console.log(episodeSaved);
      res.redirect(`/admin/addEp/${anime}/${seasonNo}/${seasonName}`)
    }
  });
});


module.exports = router;
