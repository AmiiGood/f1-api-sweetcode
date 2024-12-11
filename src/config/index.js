const connectDB = require("./database");
const swagger = require("./swagger");

module.exports = {
  connectDB,
  swagger,
  // Configuraciones globales de la aplicación
  app: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development",
    apiPrefix: "/api",
  },
  // Configuración de paginación por defecto
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
  // Configuración de rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de solicitudes por windowMs
  },
  // Configuración de cache
  cache: {
    ttl: 60 * 60 * 1000, // 1 hora en milisegundos
  },
  // Configuración de cors
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
};
