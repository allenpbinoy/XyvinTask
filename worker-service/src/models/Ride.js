const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  riderId: String,
  pickup: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  drop: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  status: {
    type: String,
    enum: [
      "REQUESTED",
      "SEARCHING",
      "WAITING_FOR_ACCEPT",
      "ASSIGNED",
      "STARTED",
      "COMPLETED",
      "CANCELLED",
    ],
    default: "REQUESTED",
  },
  driverId: String,
}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);
