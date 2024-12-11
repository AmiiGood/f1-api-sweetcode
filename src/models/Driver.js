const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true },
  driverRef: String,
  number: String,
  code: String,
  forename: String,
  surname: String,
  dob: Date,
  nationality: String,
  url: String,
});

module.exports = mongoose.model("Driver", driverSchema);
