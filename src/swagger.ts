import swaggerJsdoc from "swagger-jsdoc";
import { allSchemas } from "./generated/schemaUtils";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IPOS API Documentation",
      version: "1.0.0",
      description:
        "This is the documentation for IPOS API, it has all the necessary endpoints",
    },
    tags: [
      { name: "Users", description: "APIs related to users in the system" },
      { name: "Shops", description: "APIs related to shops in the system" },
      {
        name: "Products",
        description: "APIs related to products in the system",
      },
      {
        name: "Categories",
        description: "APIs related to categories in the system",
      },
      {
        name: "Brands",
        description: "APIs related to brands in the system",
      },
      {
        name: "Units",
        description: "APIs related to units in the system",
      },
      {
        name: "Suppliers",
        description: "APIs related to suppliers in the system",
      },
      {
        name: "Customers",
        description: "APIs related to customers in the system",
      },
      {
        name: "Sales",
        description: "APIs related to sales in the system",
      },
      {
        name: "Adjustments",
        description: "APIs related to Adjustments in the system",
      },
      {
        name: "Purchases",
        description: "APIs related to Purchases in the system",
      },
      {
        name: "Expenses",
        description: "APIs related to Expenses in the system",
      },
      {
        name: "Expense Categories",
        description: "APIs related to Expense Categories in the system",
      },
      {
        name: "Notifications",
        description: "APIs related to Notifications in the system",
      },
      {
        name: "Payees",
        description: "APIs related to Payees in the system",
      },
    ],
    components: {
      schemas: allSchemas,
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
