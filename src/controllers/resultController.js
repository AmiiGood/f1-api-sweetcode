const Result = require("../models/Result");
const { AppError } = require("../middleware/errorHandler");

exports.getResults = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      raceId,
      driverId,
      sortBy = "points",
      order = "desc",
    } = req.query;

    const query = {};
    if (raceId) query.raceId = raceId;
    if (driverId) query.driverId = driverId;

    const [results, total] = await Promise.all([
      Result.find(query)
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit)),
      Result.countDocuments(query),
    ]);

    res.json({
      status: "success",
      data: results,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

exports.getResult = async (req, res, next) => {
  try {
    const result = await Result.findOne({ resultId: req.params.id });
    if (!result) {
      return next(new AppError(404, "Result not found"));
    }

    res.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
