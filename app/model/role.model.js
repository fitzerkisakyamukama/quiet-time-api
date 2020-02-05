const mongoose = require('mongoose'), Schema = mongoose.Schema;
const RoleSchema = mongoose.Schema({
  name: String
});
module.exports = mongoose.model('Role', RoleSchema);
