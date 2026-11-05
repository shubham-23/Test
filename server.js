const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(express.json());

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Student Management API",
            version: "1.0.0",
            description: "API documentation for Student Management System"
        },

        servers: [
            {
                url: "http://localhost:5000"
            }
        ]
    },

    apis: ["./routes/*.js"]
};

// Generate Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Swagger UI route
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
);

// Student routes
app.use("/students", studentRoutes);

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
    console.log("Swagger: http://localhost:5000/api-docs");
});