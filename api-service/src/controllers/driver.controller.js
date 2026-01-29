const Driver = require("../models/Driver");


exports.createDriver = async (req, res) => {
  try {
    const { name } = req.body;
    const driver = await Driver.create({ name });
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
