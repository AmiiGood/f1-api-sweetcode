const mongoose = require("mongoose");

const circuitSchema = new mongoose.Schema({
  circuitId: { type: String, required: true, unique: true },
  circuitRef: String,
  name: String,
  location: String,
  country: String,
  lat: Number,
  lng: Number,
  alt: Number,
  url: String,
});

module.exports = mongoose.model("Circuit", circuitSchema);
