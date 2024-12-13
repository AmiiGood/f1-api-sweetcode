const axios = require("axios");
const cheerio = require("cheerio");

//funcion auxiliar para obtener la imagen de un piloto desde su url de wikipedia

const getWikipediaImage = async (wikipediaUrl) => {
  try {
    const response = await axios.get(wikipediaUrl);
    const $ = cheerio.load(response.data);

    // Búsqueda más exhaustiva de imágenes
    const possibleSelectors = [
      ".infobox-image img", // Infobox común
      ".thumbimage", // Imágenes en miniatura
      ".biography .image img", // Algunas biografías
      "table.infobox img", // Infobox alternativa
      ".vcard img", // Formato vcard
      "img.mw-file-element", // Nuevo formato de Wikipedia
    ];

    let imageUrl = null;

    // Intentar cada selector hasta encontrar una imagen
    for (const selector of possibleSelectors) {
      const img = $(selector).first();
      if (img.length > 0) {
        imageUrl = img.attr("src") || img.attr("data-src");
        if (imageUrl) break;
      }
    }

    // Arreglar URLs relativas
    if (imageUrl) {
      if (imageUrl.startsWith("//")) {
        imageUrl = "https:" + imageUrl;
      } else if (imageUrl.startsWith("/")) {
        imageUrl = "https://wikipedia.org" + imageUrl;
      }
    }

    // Verificar si la imagen es válida
    if (imageUrl) {
      try {
        await axios.head(imageUrl);
        return imageUrl;
      } catch {
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching Wikipedia image:", error.message);
    return null;
  }
};

module.exports = getWikipediaImage;
