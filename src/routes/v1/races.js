const express = require("express");
const router = express.Router();
const raceController = require("../../controllers/raceController");
const cacheMiddleware = require("../../middleware/cache");

router.get("/", cacheMiddleware(300), raceController.getRaces);
router.get("/:id", cacheMiddleware(300), raceController.getRace);

module.exports = router;
