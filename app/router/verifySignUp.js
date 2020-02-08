const config = require('../config/config.js');
const ROLEs = config.ROLEs;
const User = require('../model/user.model.js');

checkDuplicateUserNameOrEmail = (req, res, next) => {
  // -> check if username is already in use
  User.findOne({ username: req.body.username })
  .exec((err, user) => {
   if(err && err.kind !== 'ObjectId') {
     res.status(500).send({
       error: "Error retrieving user with username = " + req.body.username
     });
     return;
   }
   if (user) {
     res.status(400).send({ error: "Username is already taken!"});
     return
   }

   // Email
   User.findOne({ email: req.body.email })
   .exec((err, user) => {
     if (err && err.kind !== 'ObjectId') {
       res.status(500).send({
         error: "Error retrieving user with Email = " + req.body.email
       });
       return;
     }
     if(user) {
       res.status(400).send({ error: "Email is already in use"});
       return;
    }
   next();
 });
});
}
checkRoleExisted = (req, res, next) => {
  for(let i=0; i<req.body.roles.length; i++) {
    if(!ROLEs.includes(req.body.roles[i].toUpperCase())){
      res.status(400).send({ error: "No Role = " + req.body.roles[i] });
      return;
    }
  }
  next();
}

const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
signUpVerify.checkRoleExisted = checkRoleExisted;

module.exports = signUpVerify;
