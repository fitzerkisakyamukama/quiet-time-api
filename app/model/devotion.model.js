const mongoose = require('mongoose'), Schema = mongoose.Schema;

const DevotionSchema = mongoose.Schema({
  title: String,
  body: String,
  username: String,
  dateCreated:{
     type: Date,
     default: Date.now
   }
});
module.exports = mongoose.model('Devotion', DevotionSchema);
