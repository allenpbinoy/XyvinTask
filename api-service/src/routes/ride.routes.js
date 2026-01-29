const router = require("express").Router();
const ctrl = require("../controllers/ride.controller");

router.post("/", ctrl.createRide);
router.get("/:id", ctrl.getRide);
router.post("/accept", ctrl.acceptRide);
router.post("/reject", ctrl.rejectRide);
router.post("/start", ctrl.startRide);
router.post("/complete", ctrl.completeRide);

module.exports = router;
