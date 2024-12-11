const express = require("express");
const router = express.Router();
const resultController = require("../../controllers/resultController");
const cacheMiddleware = require("../../middleware/cache");

router.get("/", cacheMiddleware(300), resultController.getResults);
router.get("/:id", cacheMiddleware(300), resultController.getResult);

module.exports = router;
