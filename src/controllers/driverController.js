const Driver = require("../models/Driver");
const { AppError } = require("../middleware/errorHandler");
const getWikipediaImage = require("../utils/wikipedia");
const axios = require("axios");

//GET /api/drivers
exports.getDrivers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      nationality,
      search,
      sortBy = "surname",
      order = "asc",
      includeImage = false,
    } = req.query;

    // Validación de parámetros
    if (page < 1 || limit < 1) {
      throw new AppError(400, "Invalid pagination parameters");
    }

    if (!["asc", "desc"].includes(order.toLowerCase())) {
      throw new AppError(400, "Invalid sort order");
    }

    const allowedSortFields = [
      "surname",
      "forename",
      "nationality",
      "driverId",
    ];
    if (!allowedSortFields.includes(sortBy)) {
      throw new AppError(406, `Cannot sort by ${sortBy}`);
    }

    const query = {};
    if (nationality) query.nationality = nationality;
    if (search) {
      query.$or = [
        { forename: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } },
      ];
    }

    const [drivers, total] = await Promise.all([
      Driver.find(query)
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit)),
      Driver.countDocuments(query),
    ]);

    if (!drivers.length) {
      throw new AppError(404, "No drivers found matching your criteria");
    }

    let processedDrivers = drivers.map((driver) => driver.toObject());

    if (includeImage === "true") {
      try {
        processedDrivers = await Promise.all(
          processedDrivers.map(async (driver) => {
            return {
              ...driver,
              imageUrl: await getWikipediaImage(driver.url),
            };
          })
        );
      } catch (error) {
        throw new AppError(502, "Error fetching driver images");
      }
    }

    res.json({
      status: "success",
      data: processedDrivers,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDriver = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new AppError(400, "Driver ID is required");
    }

    const { includeImage = false } = req.query;
    const driver = await Driver.findOne({ driverId: req.params.id });

    if (!driver) {
      throw new AppError(404, `Driver with ID ${req.params.id} not found`);
    }

    let responseData = driver.toObject();

    if (includeImage === "true") {
      try {
        const imageUrl = await getWikipediaImage(driver.url);
        responseData.imageUrl = imageUrl || "Driver image not found";
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(502, "Error fetching driver image");
      }
    }

    res.json({
      status: "success",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDriverImage = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new AppError(400, "Driver ID is required");
    }

    const driver = await Driver.findOne({ driverId: req.params.id });

    if (!driver) {
      throw new AppError(404, "Driver not found");
    }

    const imageUrl = await getWikipediaImage(driver.url);

    if (!imageUrl) {
      throw new AppError(404, "Image not found");
    }

    if (req.query.redirect === "true") {
      res.redirect(imageUrl);
    } else {
      try {
        const imageResponse = await axios.get(imageUrl, {
          responseType: "arraybuffer",
          timeout: 5000, // 5 segundos de timeout
        });

        const contentType = imageResponse.headers["content-type"];

        res.set({
          "Content-Type": contentType,
          "Content-Length": imageResponse.data.length,
          "Cache-Control": "public, max-age=86400",
        });

        res.send(imageResponse.data);
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          throw new AppError(504, "Image download timeout");
        }
        throw new AppError(502, "Error downloading image");
      }
    }
  } catch (error) {
    next(error);
  }
};

//POST /api/drivers
exports.createDriver = async (req, res, next) => {
  try {
    const {
      driverId,
      driverRef,
      number,
      code,
      forename,
      surname,
      dob,
      nationality,
      url,
    } = req.body;

    if (!driverId || !forename || !surname) {
      throw new AppError(400, "Missing required fields");
    }

    const existingDriver = await Driver.findOne({ driverId });

    if (existingDriver) {
      throw new AppError(409, `Driver with ID ${driverId} already exists`);
    }

    const driver = await Driver.create({
      driverId,
      driverRef,
      number,
      code,
      forename,
      surname,
      dob: dob ? new Date(dob) : undefined,
      nationality,
      url,
    });

    res.status(201).json({
      status: "success",
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findOneAndDelete({ driverId: req.params.id });

    if (!driver) {
      throw new AppError(404, `Driver with ID ${req.params.id} not found`);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
