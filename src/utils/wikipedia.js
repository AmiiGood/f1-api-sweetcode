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

module.exports = getWikipediaImage;
