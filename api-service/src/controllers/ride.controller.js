const Ride = require("../models/Ride");
const rideQueue = require("../queues/ride.queue");

exports.createRide = async (req, res) => {
  const { riderId, pickup, drop } = req.body;
  

  try {
    const ride = await Ride.create({
      riderId,
      pickup: { type: "Point", coordinates: pickup },
      drop: { type: "Point", coordinates: drop },
      status: "SEARCHING", 
    });


    await rideQueue.add("searchDriver", { rideId: ride._id });

    res.json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: "Ride not found" });
    res.json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptRide = async (req, res) => {
  const { rideId, driverId } = req.body;
  await rideQueue.add("driverResponse", { rideId, driverId, response: "accept" });
  res.json({ message: "Response submitted" });
};

exports.rejectRide = async (req, res) => {
  const { rideId, driverId } = req.body;
  await rideQueue.add("driverResponse", { rideId, driverId, response: "reject" });
  res.json({ message: "Response submitted" });
};

exports.startRide = async (req, res) => {
  const { rideId } = req.body;
  await rideQueue.add("updateRideStatus", { rideId, status: "STARTED" });
  res.json({ message: "Ride start requested" });
};

exports.completeRide = async (req, res) => {
  const { rideId } = req.body;
  await rideQueue.add("updateRideStatus", { rideId, status: "COMPLETED" });
  res.json({ message: "Ride completion requested" });
};
