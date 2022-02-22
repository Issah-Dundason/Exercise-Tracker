const express = require('express')
const mongoose = require('mongoose');
const app = express()
const cors = require('cors')
const {Exercise, User}= require('./model.js');
var bodyParser = require('body-parser');
const { application } = require('express');
const { json } = require('body-parser');
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
  } else {
    date = new Date(date).toDateString();
  }
  const userFinder = User.findById(req.params._id);
  userFinder.exec((err, user) => {
    if(err) {
      console.log(err);
    } else {
      Exercise.create({
        username : user._id,
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
            });
          }
        })
    }
  })
})


app.get('/api/users/:_id/logs', (req, res) => {
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  User.findById(req.params._id).exec((err, user) => {
    if(err) {
      console.log(err);
    } else {
      Exercise
      .find({username : user._id})
      .select("+description +duration +date")
      .exec((err, exercises) => {
        if(err) {
          console.log(err);
        } else {
          if(from) {
            exercises = exercises.filter(exercise => new Date(exercise.date).getTime() >= new Date(from).getTime())
          }
          if(to) {
            exercises = exercises.filter(exercise => new Date(exercise.date).getTime() <= new Date(to).getTime())
          }
          if(limit) {
            exercises = exercises.slice(0, Number(limit));
          }
          res.json({
            username: user.username,
            _id : user._id,
            count : exercises.length,
            log : exercises
          });
        }
      });
    }
  });
})