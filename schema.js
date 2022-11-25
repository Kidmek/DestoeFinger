const mongoose = require('mongoose');

//creating model Schema
const games = new mongoose.Schema({
  newGame: {
      type:String,
    },
  players: [{
          type: String,
          required: true,
        }]
});
const tournaments = new mongoose.Schema({
  newGame: {
      type:String,
    },
  players: [{
          type: String,
          required: true,
        }]
});
const Games = mongoose.model('Games', games);
const Tournaments = mongoose.model('Tournaments', tournaments)
module.exports = {Games , Tournaments};