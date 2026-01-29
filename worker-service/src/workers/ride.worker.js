const { Worker } = require("bullmq");
const redis = require("../config/redis");
const path = require("path");

const Ride = require("../models/Ride");
const Driver = require("../models/Driver");

const rideWorker = new Worker(
  "rideQueue",
  async job => {
    try {
      if (job.name === "searchDriver") {
        const { rideId } = job.data;
        const ride = await Ride.findById(rideId);
        if (!ride || ride.status !== "SEARCHING") return;

        
        const drivers = await Driver.find({
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: ride.pickup.coordinates,
              },
              $maxDistance: 50000, 
            },
          },
          status: "AVAILABLE",
        }).limit(10);

        let assignedDriver = null;


        for (const driver of drivers) {
          assignedDriver = await Driver.findOneAndUpdate(
            { _id: driver._id, status: "AVAILABLE" },
            { status: "ON_RIDE" },
            { new: true }
          );
          if (assignedDriver) break;
        }

        if (assignedDriver) {
          ride.driverId = assignedDriver._id;
          ride.status = "WAITING_FOR_ACCEPT";
          await ride.save();
          console.log(`Ride ${rideId} matched with driver ${assignedDriver.name}`);
          
        } else {
          console.log(`No drivers found for ride ${rideId}`);
         
        }
      } else if (job.name === "driverResponse") {
        const { rideId, driverId, response } = job.data;
        const ride = await Ride.findById(rideId);
        if (!ride) return;

        if (response === "accept") {
          if (ride.status === "WAITING_FOR_ACCEPT" && ride.driverId === driverId) {
            ride.status = "ASSIGNED";
            await ride.save();
            console.log(`Ride ${rideId} accepted by driver ${driverId}`);
          } else {
            console.log(`Ride ${rideId} no longer valid for acceptance`);
           
            await Driver.findByIdAndUpdate(driverId, { status: "AVAILABLE" });
          }
        } else if (response === "reject") {

          await Driver.findByIdAndUpdate(driverId, { status: "AVAILABLE" });

          if (ride.status === "WAITING_FOR_ACCEPT") {
            ride.status = "SEARCHING"; 
            ride.driverId = null;
            await ride.save();
          
            await module.exports.rideQueue.add("searchDriver", { rideId: ride._id });
            console.log(`Ride ${rideId} rejected by driver ${driverId}, searching again...`);
          }
        }
      } else if (job.name === "updateRideStatus") {
        const { rideId, status } = job.data;
        const ride = await Ride.findById(rideId);
        if (!ride) return;

        if (status === "STARTED" && ride.status === "ASSIGNED") {
          ride.status = "STARTED";
          await ride.save();
        } else if (status === "COMPLETED" && ride.status === "STARTED") {
          ride.status = "COMPLETED";
          await ride.save();

          
          if (ride.driverId) {
            await Driver.findByIdAndUpdate(ride.driverId, { status: "AVAILABLE" });
          }
        }
      }
    } catch (err) {
      console.error("Job failed:", err);
      throw err;
    }
  },
  { connection: redis }
);


module.exports.rideQueue = require("../../../api-service/src/queues/ride.queue");

rideWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

module.exports = rideWorker;
