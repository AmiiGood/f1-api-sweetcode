const express = require("express");
const router = express.Router();
const driverController = require("../../controllers/driverController");
const { validate, commonSchemas } = require("../../middleware/validator");
const cacheMiddleware = require("../../middleware/cache");

router.get("/", cacheMiddleware(300), driverController.getDrivers);
router.get("/:id", cacheMiddleware(300), driverController.getDriver);

module.exports = router;