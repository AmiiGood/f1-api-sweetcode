const Driver = require("../models/Driver");
const { AppError } = require("../middleware/errorHandler");

exports.getDrivers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      nationality,
      search,
      sortBy = "surname",
      order = "asc",
    } = req.query;

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

    res.json({
      status: "success",
      data: drivers,
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
    const driver = await Driver.findOne({ driverId: req.params.id });
    if (!driver) {
      return next(new AppError(404, "Driver not found"));
    }

    res.json({
      status: "success",
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};
