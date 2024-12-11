const express = require("express");
const router = express.Router();
const circuitController = require("../../controllers/circuitController");
const cacheMiddleware = require("../../middleware/cache");

router.get("/", cacheMiddleware(300), circuitController.getCircuits);
router.get("/:id", cacheMiddleware(300), circuitController.getCircuit);

module.exports = router;
