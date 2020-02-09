const config  = require('../config/config.js');
const Role = require('../model/role.model.js');
const User = require('../model/user.model.js');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


exports.signup = (req,res) => {
  // Save User to Databse
  console.log("Processing func -> SignUp");
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      residence: req.body.residence,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    // Sasve a user to the MongoDb
    user.save().then(savedUser => {
      Role.find({
        'name': { $in: req.body.roles.map(role => role.toUpperCase()) }
      }, (err,roles) => {etRoles
        if(err)
        res.status(500).send({ reason: err.message });

        // updare user with Roles
        savedUser.roles = roles.map(role => role._id);
        savedUser.save(function(err) {
          if (err)
          res.status(500).send({reason: err.message });

          res.status(200).send({ message: "User created successfully!"});
        });
      });
    }).catch(err => {
      res.status(500).send({ reason: err.message  });
    });
  }



exports.signin = (req, res) => {
  console.log("Sign - In");

  User.findOne({ username: req.body.username})
  .exec((err, user) => {
    if(err){
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with username = " + req.body.username
        });
      }
      return res.status(500).send({
        message: "Error retrieving User with Username = " + req.body.username
      });
    }

    if(!user){
      return res.status(401).send({
        // user does not exiist
        auth: false, accessToken: null,
        reason: "Invalid username or password"
      });
    }else{

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if(!passwordIsValid) {
        // wrong password
        return res.status(401).send({ auth: false, accessToken: null, reason: 'Invalid username or password !'});
      }

      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });

      var authorities = [];
      Role.find({
        '_id':{ $in: user.roles}
      }, (err, roles) => {
        if(err)
          res.status(500).send({ message: 'Unable to login user consult system admin'});
        var authorities = [];
        for(let i =0; i<roles.length; i++) {
          // let role = roles[i].name.toUpperCase();
          authorities.push('ROLE_' + roles[i].name.toUpperCase());

        }
        return res.status(200).send({auth: true, accessToken: token, username: user.username, authorities: authorities });

      });
    }
   });
}

exports.userContent = (req, res) => {
  User.findOne({ _id: req.userId })
  .select('-_id -__v -password')
  .populate('roles', '-_id -__v')
  .exec((err,user) => {
    if(err) {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with _id = " + req.userId
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with id = " + req.userId
      });
    }
    res.status(200).json({
      "description": "User content Page",
      "user": user
    });
  });
}

exports.adminBoard = (req, res) => {
  User.findOne({ _id: req.userId })
  .select('-_id -__v -password')
  .populate('roles', '-_id -__v')
  .exec((err,user) => {
    if(err) {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with _id = " + req.userId
        });
      }
      return res.status(500).send({
        "description": "Can not access Admin Board",
        "error": err
      });
      return;
    }
    res.status(200).json({
      "description": "Admin Board",
      "user": user
    });
  });
}

exports.managementBoard = (req, res) => {
  User.findOne({ _id: req.userId })
  .select('-_id -__v -password')
  .populate('roles', '-_id -__v')
  .exec((err,user) => {
    if(err) {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with _id = " + req.userId
        });
      }
      return res.status(500).send({
        "description": "Can not access Management Board",
        "error": err
      });
      return;
    }
    res.status(200).json({
      "description": "Manager's Board",
      "user": user
    });
  });
}
