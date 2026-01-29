const Driver = require("../models/Driver");

exports.createDriver = async (req, res) => {
  const { name, lat, lng } = req.body;
  try {
    const driver = await Driver.create({
      name,
      location: { type: "Point", coordinates: [lng, lat] },
      status: "AVAILABLE",
    });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  const { driverId, lat, lng } = req.body;
  try {
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      {
        location: { type: "Point", coordinates: [lng, lat] },
      },
      { new: true }
    );
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
