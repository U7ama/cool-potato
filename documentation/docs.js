const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CoolPotato API Documentation",
      version: "1.0.0",
      description: "A simple API to process images for recipes",
    },
    servers: [
      {
        url: process.env.APP_URL,
      },
    ],
  },

  apis: ["./routes/*.js", "./documentation/api-docs.yaml"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
