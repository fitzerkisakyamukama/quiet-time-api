const Role = require('./role.model.js');
const mongoose = require('mongoose'), Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  datOfBirth: Date,
  gender: String,
  email: String,
  residence: String,
  registeredFrom: String, // location
  password: String,
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role'}],
  dateCreated:{
     type: Date,
     default: Date.now
   }
});
module.exports = mongoose.model('User', UserSchema);
