const Race = require("../models/Race");
const { AppError } = require("../middleware/errorHandler");

exports.getRaces = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      year,
      circuit,
      sortBy = "date",
      order = "desc",
    } = req.query;

    const query = {};
    if (year) query.year = Number(year);
    if (circuit) query.circuitId = circuit;

    const [races, total] = await Promise.all([
      Race.find(query)
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit)),
      Race.countDocuments(query),
    ]);

    res.json({
      status: "success",
      data: races,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRace = async (req, res, next) => {
  try {
    const race = await Race.findOne({ raceId: req.params.id });
    if (!race) {
      return next(new AppError(404, "Race not found"));
    }

    res.json({
      status: "success",
      data: race,
    });
  } catch (error) {
    next(error);
  }
};
