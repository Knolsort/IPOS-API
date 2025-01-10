import express from "express";
import {
  getGProducts,
  getSingleGProduct,
  updateGProductById,
  deleteGProductById,
  createGProduct,
} from "../controllers/gproducts";

const gProductRouter = express.Router();

/**
 * @swagger
 * /api/v1/gproducts:
 *   post:
 *     summary: Create a new GProduct
 *     tags: [GProducts]
 *     description: Creates a new gproduct in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GProduct'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GProduct'
 */

gProductRouter.post("/gproducts", createGProduct);

/**
 * @swagger
 * tags:
 *   name: GProducts
 *   description: APIs related to gproducts in the system
 */

/**
 * @swagger
 *  /api/v1/gproducts:
 *   get:
 *     summary: Get all products
 *     tags: [GProducts]
 *     responses:
 *       200:
 *         description: List of all gproducts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GProduct'
 */
gProductRouter.get("/gproducts", getGProducts);

/**
 * @swagger
 *  /api/v1/gproducts/:{id}:
 *   get:
 *     summary: Get a single gproduct by ID
 *     tags: [GProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The gproduct ID
 *     responses:
 *       200:
 *         description: The gproduct data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GProduct'
 *       404:
 *         description: GProduct not found
 */
gProductRouter.get("/gproducts/:id", getSingleGProduct);

/**
 * @swagger
 *  /api/v1/gproducts/:{id}:
 *   put:
 *     summary: Update a gproduct by ID
 *     tags: [GProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The gproduct ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GProduct'
 *     responses:
 *       200:
 *         description: The updated gproduct data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GProduct'
 *       404:
 *         description: Product not found
 */
gProductRouter.put("/gproducts/:id", updateGProductById);

/**
 * @swagger
 *  /api/v1/gproducts/:{id}:
 *   delete:
 *     summary: Delete a gproduct by ID
 *     tags: [GProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The gproduct ID
 *     responses:
 *       200:
 *         description: GProduct deleted successfully
 *       404:
 *         description: GProduct not found
 */
gProductRouter.delete("/gproducts/:id", deleteGProductById);

export default gProductRouter;
