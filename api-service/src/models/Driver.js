const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: String,
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Driver", driverSchema);
