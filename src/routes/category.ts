import {
  createCategory,
  deleteCategoryById,
  getCategories,
  getSingleCategory,
  updateCategoryById,
} from "../controllers/categories";
import express from "express";

const categoryRouter = express.Router();

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     description: Creates a new category in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
categoryRouter.post("/categories", createCategory);

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     description: Retrieve a list of categories from the database.
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
categoryRouter.get("/categories", getCategories);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Retrieve a single category by ID
 *     tags: [Categories]
 *     description: Retrieve a single category from the database by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: A single category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
categoryRouter.get("/categories/:id", getSingleCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     description: Update a category in the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
categoryRouter.put("/categories/:id", updateCategoryById);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     description: Delete a category from the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Category not found
 */
categoryRouter.delete("/categories/:id", deleteCategoryById);

export default categoryRouter;
