var mongoose = require("mongoose");


var EpisodeSchema = mongoose.Schema({
  anime:{type:String},
  seasonNo:{type:String},
  episodeNo:{type:String},
  name:{type:String},
  vid:{type:String},
  date_created:{type: Date, default: Date.now}
});
module.exports = mongoose.model("Episode", EpisodeSchema, "Episode");
