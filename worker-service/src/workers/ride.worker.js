const { Worker } = require("bullmq");
const redis = require("../config/redis");
const path = require("path");

const Ride = require("../models/Ride");
const Driver = require("../models/Driver");

const rideWorker = new Worker(
  "rideQueue",
  async job => {
    try {
      if (job.name === "assignDriver") {
        const { rideId } = job.data;

        const ride = await Ride.findById(rideId);
        if (!ride || ride.status !== "REQUESTED") return;

        const driver = await Driver.findOne({ isAvailable: true });
        if (!driver) {
          console.log("No drivers available, retrying...");
          throw new Error("No drivers available");
        }

        driver.isAvailable = false;
        await driver.save();

        ride.driverId = driver._id;
        ride.status = "ASSIGNED";
        await ride.save();

        console.log("Driver assigned successfully for ride:", rideId);
      }
    } catch (err) {
      console.error("Job failed:", err);
      throw err; 
    }
  },
  { connection: redis }
);

rideWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

module.exports = rideWorker;
