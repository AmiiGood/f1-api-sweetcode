const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  resultId: { type: String, required: true, unique: true },
  raceId: String,
  driverId: String,
  constructorId: String,
  number: Number,
  grid: Number,
  position: String,
  positionText: String,
  positionOrder: Number,
  points: Number,
  laps: Number,
  time: String,
  milliseconds: String,
  fastestLap: String,
  rank: String,
  fastestLapTime: String,
  fastestLapSpeed: String,
  statusId: String,
});

module.exports = mongoose.model("Result", resultSchema);
