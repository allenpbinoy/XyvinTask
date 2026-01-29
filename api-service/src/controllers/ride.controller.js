const Ride = require("../models/Ride");
const rideQueue = require("../queues/ride.queue");

exports.createRide = async (req, res) => {
  const { riderId, pickup, drop } = req.body;

  const ride = await Ride.create({ riderId, pickup, drop });

  await rideQueue.add("assignDriver", { rideId: ride._id });

  res.json(ride);
};

exports.getRide = async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  res.json(ride);
};
