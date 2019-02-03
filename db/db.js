const mongoose = require('mongoose');
// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to db
mongoose.connect(process.env.MONGODB_URI ||'mongodb://127.0.0.1:27017/animespot', {useNewUrlParser: true});
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to db");
});
