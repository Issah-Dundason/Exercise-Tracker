const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    username : String,
    description : String,
    duration : Number,
    date : String
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

const userSchema = new mongoose.Schema({
    username : String
})

const User = mongoose.model('User', userSchema);


module.exports.Exercise = Exercise;
module.exports.User = User;