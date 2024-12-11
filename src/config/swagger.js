const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Formula 1 API",
      version: "1.0.0",
      description: "API for accessing Formula 1 historical data",
      contact: {
        name: "API Support",
        url: "https://github.com/yourusername/f1-api-sweetcode",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Driver: {
          type: "object",
          properties: {
            driverId: { type: "string" },
            driverRef: { type: "string" },
            number: { type: "number" },
            code: { type: "string" },
            forename: { type: "string" },
            surname: { type: "string" },
            dateOfBirth: { type: "string", format: "date" },
            nationality: { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            code: { type: "integer" },
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/**/*.js"], // Rutas donde buscar anotaciones de swagger
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
  specs,
};
