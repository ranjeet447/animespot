var mongoose = require("mongoose");


var AnimeSchema = mongoose.Schema({
    name: {
      type: String,
      index: true
    },
    genre:[
      {type:String}
    ],
    ongoing:{
      type: Boolean,
    },
    lastEpisode:{type: Date, default: Date.now},
    seasons:[
      {
        number:{type:String},
        name:{type:String},
      }
    ],
    description:{type:String},
    date_created:{type: Date, default: Date.now}
});
module.exports = mongoose.model("Anime", AnimeSchema, "Anime");
