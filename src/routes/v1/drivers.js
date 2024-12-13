const express = require("express");
const router = express.Router();
const driverController = require("../../controllers/driverController");
const { validate, commonSchemas } = require("../../middleware/validator");
const cacheMiddleware = require("../../middleware/cache");
const driverSchema = require("../../schemas/driverSchema");

router.get("/", cacheMiddleware(300), driverController.getDrivers);
router.get("/:id", cacheMiddleware(300), driverController.getDriver);
router.get("/:id/image", cacheMiddleware(300), driverController.getDriverImage);
router.post("/", validate(driverSchema), driverController.createDriver);
router.delete("/:id", driverController.deleteDriver);

module.exports = router;
