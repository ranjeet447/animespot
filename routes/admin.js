//admin Routes
const express = require("express");
const path = require('path');
const router = express.Router();

const Anime = require('../db/models/anime');
const Episode = require('../db/models/episode');

const ap = process.env.ADMIN || "5";

function isAdmin(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect('/admin')
  }
}

router.get('/', (req, res) => {
  res.render('admin');
});
router.post('/admin', function (req, res) {
  // console.log(req.body);
  let pass = req.body.password
  let sess = req.session;
  // console.log(pass,sess);
  if (pass === ap) {
    sess.admin = true;
    res.redirect('/admin/addAnime')
  }
  else {
    sess.admin = false;
    res.redirect('/admin')
  }
});

router.get('/addAnime', isAdmin, (req, res) => {
  Anime.find({}, {}, { lean: true }, function (err, foundData) {
    if (err) {
      throw err;
    } else {
      res.render('addAnime', { data: foundData });
      // console.log(foundData);
    }
  });
});

router.post('/addAnime', isAdmin, (req, res) => {
  // console.log(req.body);
  let anime = new Anime({
    name: req.body.name.trim(),
    image:req.body.image.trim(),
    description: req.body.description.trim(),
    genre: req.body.genre,
    ongoing: req.body.ongoing
  });
  anime.save(function (err, animeSaved) {
    if (err) throw err;
    else {
      res.redirect('/admin/addAnime');
    }
  });
});

router.post('/editAnime/:id', isAdmin, (req, res) => {
  // console.log(req.body);
  let id = req.params.id;
  let anime = {
    name: req.body.name.trim(),
    image:req.body.image.trim(),
    description: req.body.description.trim(),
    genre: req.body.genre,
    ongoing: req.body.ongoing
  };
  Anime.findOneAndUpdate({ _id: id }, { $set: anime }, function (err, animeSaved) {
    if (err) throw err;
    else {
      res.redirect('/admin/addAnime');
    }
  });
});

router.get('/addS/:anime', isAdmin, (req, res) => {
  let name = req.params.anime;
  Anime.find({ name }, function (err, foundData) {
    if (err) {
      throw err;
    } else {
      // console.log(foundData);
      res.render('addS', { data: foundData });
    }
  });
});

router.post('/addSeason/:anime', isAdmin, (req, res) => {
  let anime = req.params.anime;
  let season = {
    number: req.body.number.trim(),
    name: req.body.name.trim()
  }
  // console.log("sss",season);
  Anime.updateOne({ name: anime }, { $push: { seasons: season } }, { new: true }, function (err, found) {
    if (err) {
      throw err;
    } else {
      res.redirect(`/admin/addS/${anime}`);
    }
  });
});

router.post('/editSeason/:anime/:sid', isAdmin, (req, res) => {
  let anime = req.params.anime;
  let sid = req.params.sid;
  let season = {
    number: req.body.number.trim(),
    name: req.body.name.trim()
  }
  // console.log("sss",season);
  Anime.updateOne({ name: anime, "seasons._id": sid }, { $set: { "seasons.$.number": season.number, "seasons.$.name": season.name } }, { new: true }, function (err, found) {
    if (err) {
      throw err;
    } else {
      res.redirect(`/admin/addS/${anime}`);
    }
  });
});
router.get('/addEp/:anime/:sno/:sname', isAdmin, (req, res) => {
  let anime = {
    name: req.params.anime,
    sno: req.params.sno,
    sname: req.params.sname
  }
  Episode.find({ anime: req.params.anime, seasonNo: req.params.sno }, null, { sort: { '_id': -1 } }, function (err, found) {
    // console.log(found);
    if (err) throw err;
    else {
      res.render('addEpisode', { anime: anime, episodes: found });
    }
  });
});

router.post('/addEp/:anime/:sno/:sname', isAdmin, (req, res) => {
  let anime = req.params.anime;
  let seasonNo = req.params.sno;
  let seasonName = req.params.sname;
  let episode = new Episode({
    anime: anime,
    seasonNo: seasonNo,
    episodeNo: req.body.number.trim(),
    name: req.body.name.trim(),
    vid: req.body.vid.trim()
  });

  episode.save(function (err, episodeSaved) {
    if (err) throw err;
    else {
      // console.log(episodeSaved);
      res.redirect(`/admin/addEp/${anime}/${seasonNo}/${seasonName}`)
    }
  });
});

router.post('/editEp/:anime/:sno/:sname/:eid', isAdmin, (req, res) => {
  let id = req.params.eid;
  let anime = req.params.anime;
  let seasonNo = req.params.sno;
  let seasonName = req.params.sname;
  let episodeNo = req.body.number.trim();
  let name = req.body.name.trim();
  let vid = req.body.vid.trim();
  Episode.findOneAndUpdate({ _id: id }, { $set: { episodeNo, name, vid } }, function (err, episode) {
    // console.log(found);
    if (err) throw err;
    else {
      res.redirect(`/admin/addEp/${anime}/${seasonNo}/${seasonName}`)
    }
  });
});

router.get('/update', async (req, res) => {
  Episode.find({anime:"Avatar"}, { "vid": 1 }).then(async es => {
    es.forEach(function (doc,i) {
      doc.anime = "Avatar: The Last Airbender"
      Episode.findOneAndUpdate(
        { "_id": doc._id },
        { "$set": { "anime": doc.anime } }, { new: true }
      ).then((e) => {
        console.log(i);
      });
    })
  })
});


module.exports = router;
