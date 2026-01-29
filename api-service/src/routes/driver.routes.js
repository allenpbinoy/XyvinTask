const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/driver.controller");

router.post("/", ctrl.createDriver);     
router.get("/", ctrl.getDrivers);        

module.exports = router;
