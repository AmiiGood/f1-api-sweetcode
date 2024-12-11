const Circuit = require("../models/Circuit");
const { AppError } = require("../middleware/errorHandler");

exports.getCircuits = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      country,
      search,
      sortBy = "name",
      order = "asc",
    } = req.query;

    const query = {};
    if (country) query.country = country;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const [circuits, total] = await Promise.all([
      Circuit.find(query)
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit)),
      Circuit.countDocuments(query),
    ]);

    res.json({
      status: "success",
      data: circuits,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCircuit = async (req, res, next) => {
  try {
    const circuit = await Circuit.findOne({ circuitId: req.params.id });
    if (!circuit) {
      return next(new AppError(404, "Circuit not found"));
    }

    res.json({
      status: "success",
      data: circuit,
    });
  } catch (error) {
    next(error);
  }
};
