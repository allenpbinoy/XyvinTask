const router = require("express").Router();
const ctrl = require("../controllers/ride.controller");

router.post("/", ctrl.createRide);
router.get("/:id", ctrl.getRide);

module.exports = router;
