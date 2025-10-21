import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application, Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Exam Scheduling API",
      version: "1.0.0",
      description: "API documentation for the Exam Scheduling system",
    }, components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://exma-rr6x.onrender.com",
        description: "Production server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at http://localhost:3000/api-docs");
};
