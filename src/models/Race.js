const mongoose = require("mongoose");

const raceSchema = new mongoose.Schema({
  raceId: { type: String, required: true, unique: true },
  year: Number,
  round: Number,
  circuitId: String,
  name: String,
  date: Date,
  time: String,
});

module.exports = mongoose.model("Race", raceSchema);
