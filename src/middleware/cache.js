const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutos

const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Solo cachear peticiones GET
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.status(200).json({
        ...cachedResponse,
        cached: true,
      });
    }

    // Modificar res.json para interceptar la respuesta y guardarla en cache
    const originalJson = res.json;
    res.json = function (body) {
      cache.set(key, body, duration);
      originalJson.call(this, body);
    };

    next();
  };
};

module.exports = cacheMiddleware;
