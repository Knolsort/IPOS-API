import {
  createExpenseCategory,
  deleteExpenseCategoryById,
  getExpenseCategories,
  getSingleExpenseCategory,
  updateExpenseCategoryById,
} from "../controllers/expense-categories";
import express from "express";

const expenseCategoryRouter = express.Router();

/**
 * @swagger
 * /api/v1/expense-categories:
 *   post:
 *     summary: Create a new expense category
 *     tags: [Expense Categories]
 *     description: Creates a new expense category in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseCategory'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseCategory'
 */
expenseCategoryRouter.post("/expense-categories", createExpenseCategory);

/**
 * @swagger
 * /api/v1/expense-categories:
 *   get:
 *     summary: Retrieve a list of expense categories
 *     tags: [Expense Categories]
 *     description: Retrieve a list of expense categories from the database.
 *     responses:
 *       200:
 *         description: A list of expense categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExpenseCategory'
 */
expenseCategoryRouter.get("/expense-categories", getExpenseCategories);

/**
 * @swagger
 * /api/v1/expense-categories/{id}:
 *   get:
 *     summary: Retrieve a single expense category by ID
 *     tags: [Expense Categories]
 *     description: Retrieve a single expense category from the database by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The expense category ID
 *     responses:
 *       200:
 *         description: A single expense category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseCategory'
 *       404:
 *         description: Expense category not found
 */
expenseCategoryRouter.get("/expense-categories/:id", getSingleExpenseCategory);

/**
 * @swagger
 * /api/v1/expense-categories/{id}:
 *   put:
 *     summary: Update an expense category by ID
 *     tags: [Expense Categories]
 *     description: Update an expense category in the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The expense category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseCategory'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseCategory'
 *       404:
 *         description: Expense category not found
 */
expenseCategoryRouter.put("/expense-categories/:id", updateExpenseCategoryById);

/**
 * @swagger
 * /api/v1/expense-categories/{id}:
 *   delete:
 *     summary: Delete an expense category by ID
 *     tags: [Expense Categories]
 *     description: Delete an expense category from the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The expense category ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Expense category not found
 */
expenseCategoryRouter.delete("/expense-categories/:id", deleteExpenseCategoryById);

export default expenseCategoryRouter;
