import {
  createBrand,
  deleteBrandById,
  getBrands,
  getSingleBrand,
  updateBrandById,
} from "../controllers/brands";
import express from "express";

const brandRouter = express.Router();

/**
 * @swagger
 * /api/v1/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     description: Creates a new brand in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 */
brandRouter.post("/brands", createBrand);

/**
 * @swagger
 * /api/v1/brands:
 *   get:
 *     summary: Retrieve a list of brands
 *     tags: [Brands]
 *     description: Retrieve a list of brands from the database.
 *     responses:
 *       200:
 *         description: A list of brands.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 */
brandRouter.get("/brands", getBrands);

/**
 * @swagger
 * /api/v1/brands/{id}:
 *   get:
 *     summary: Retrieve a single brand by ID
 *     tags: [Brands]
 *     description: Retrieve a single brand from the database by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The brand ID
 *     responses:
 *       200:
 *         description: A single brand.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 */
brandRouter.get("/brands/:id", getSingleBrand);

/**
 * @swagger
 * /api/v1/brands/{id}:
 *   put:
 *     summary: Update a brand by ID
 *     tags: [Brands]
 *     description: Update a brand in the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 */
brandRouter.put("/brands/:id", updateBrandById);

/**
 * @swagger
 * /api/v1/brands/{id}:
 *   delete:
 *     summary: Delete a brand by ID
 *     tags: [Brands]
 *     description: Delete a brand from the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The brand ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Brand not found
 */
brandRouter.delete("/brands/:id", deleteBrandById);

export default brandRouter;
