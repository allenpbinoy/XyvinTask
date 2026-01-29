const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  riderId: String,
  pickup: String,
  drop: String,
  status: {
    type: String,
    enum: ["REQUESTED", "ASSIGNED", "STARTED", "COMPLETED"],
    default: "REQUESTED",
  },
  driverId: String,
}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);
