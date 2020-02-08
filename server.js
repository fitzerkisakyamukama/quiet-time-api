var express = require('express');
var app = express();
const path =  require('path')
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());




require('./app/router/router.js')(app);
const Role = require('./app/model/role.model.js');

//configuring the databse
const config = require('./app/config/config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database -> url or onlineUrl
mongoose.connect(config.onlineUrl, { useNewUrlParser: true ,  useUnifiedTopology: true })
.then(() => {
  console.log('Succcessfully connected to MongoDB.');
  initial();
}).catch(err => {
  console.log('Could not connect to MongoDB');
  process.exit();
});

// for heroku case
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});

// Create a Server
var server = app.listen(process.env.PORT || 8080, function() {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at http://%s:%s", host, port);
});

function initial()
{
  Role.countDocuments((err, count) => {
    if(!err && count === 0) {
      // user tole ->
      new Role({
        name: 'USER'
      }).save( err => {
        if ( err) return console.error(err.stack)
        console.log(" USER_ROLE is added")
      });

      // AMDIN tole ->
      new Role({
        name: 'ADMIN'
      }).save( err => {
        if ( err) return console.error(err.stack)
        console.log(" ADMIN_ROLE is added")
      });

      // MANAGER tole ->
      new Role({
        name: 'MANAGER'
      }).save( err => {
        if ( err) return console.error(err.stack)
        console.log("MANAGER_ROLE is added")
      });
    }
  });
}
