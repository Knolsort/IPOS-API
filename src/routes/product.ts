import {
  createProduct,
  deleteProductById,
  getProducts,
  getSingleProduct,
  updateProductById,
} from "../controllers/products";

import express from "express";

const productRouter = express.Router();

productRouter.post("/products", createProduct);
productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getSingleProduct);
productRouter.put("/products/:id", updateProductById);
productRouter.delete("/products/:id", deleteProductById);

export default productRouter;
