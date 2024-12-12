const Driver = require("../models/Driver");
const { AppError } = require("../middleware/errorHandler");
const axios = require("axios");
const cheerio = require("cheerio");

//funcion auxiliar para obtener la imagen de un piloto desde su url de wikipedia

async function getWikipediaImage(wikipediaUrl) {
  try {
    const response = await axios.get(wikipediaUrl);
    const $ = cheerio.load(response.data);

    // Intenta obtener la imagen de la infobox de wikipedia
    let imageUrl = $(".infobox-image img").first().attr("src");

    // Si no se encuentra la imagen en la infobox, intenta obtener la primera imagen de la página
    if (!imageUrl) {
      imageUrl = $(".thumbimage").first().attr("src");
    }

    if (imageUrl && imageUrl.startsWith("//")) {
      imageUrl = "https:" + imageUrl;
    }

    return imageUrl || null;
  } catch (error) {
    console.error("Error fetching Wikipedia image:", error);
    return null;
  }
}

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

    let processedDrivers = drivers.map((driver) => driver.toObject());

    if (includeImage === "true") {
      processedDrivers = await Promise.all(
        processedDrivers.map(async (driver) => {
          return {
            ...driver,
            imageUrl: await getWikipediaImage(driver.url),
          };
        })
      );
    }

    res.json({
      status: "success",
      data: processedDrivers,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    console.error("Error in getDrivers:", error);
    next(error);
  }
};

exports.getDriver = async (req, res, next) => {
  try {
    const { includeImage = false } = req.query;
    const driver = await Driver.findOne({ driverId: req.params.id });

    if (!driver) {
      return next(new AppError(404, "Driver not found"));
    }

    let responseData = driver.toObject();

    if (includeImage === "true") {
      responseData.imageUrl = await getWikipediaImage(driver.url);
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
    const driver = await Driver.findOne({ driverId: req.params.id });

    if (!driver) {
      return next(new AppError(404, "Driver not found"));
    }

    const imageUrl = await getWikipediaImage(driver.url);

    if (!imageUrl) {
      return next(new AppError(404, "Image not found"));
    }

    if (req.query.redirect === "true") {
      res.redirect(imageUrl);
    } else {
      try {
        // Descarga la imagen
        const imageResponse = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });

        // Detecta el tipo de contenido de la imagen
        const contentType = imageResponse.headers["content-type"];

        res.set({
          "Content-Type": contentType,
          "Content-Length": imageResponse.data.length,
          "Cache-Control": "public, max-age=86400", // Cache por 24 horas
        });

        // Envía la imagen directamente
        res.send(imageResponse.data);
      } catch (error) {
        console.error("Error downloading image:", error);
        return next(new AppError(500, "Error downloading image"));
      }
    }
  } catch (error) {
    next(error);
  }
};
