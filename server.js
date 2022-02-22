const express = require('express')
const mongoose = require('mongoose');
const app = express()
const cors = require('cors')
const {Exercise, User}= require('./model.js');
var bodyParser = require('body-parser');
const { application } = require('express');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({extended: false}));


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  User.create({username: username}, (err, user) => {
    if(err) {
      console.log("err");
    }
    res.json({username: user.username, _id : user._id});
  });
});

app.get('/api/users', (req, res) => {
  User.find().select('-__v').exec((err, users) => {
    if(err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
})


app.post('/api/users/:_id/exercises', (req, res) => {
  let {description, duration, date} = req.body;
  if(!date) {
    date = new Date().toDateString();
  }
  User.findById({_id : req.params._id}, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      Exercise.create({
        username : user.username, 
        description : description, 
        duration : Number(duration), 
        date : date}, (err, exercise) => {
          if(err) {
            console.log(err);
          } else {
            res.json({
              username: user.username,
              description: exercise.description,
              duration: exercise.duration,
              date: exercise.date,
              _id: user._id
            })
          }
        })
    }
  });
})
