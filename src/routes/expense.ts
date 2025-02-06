import {
  createExpense,
  deleteExpenseById,
  getExpenses,
  getSingleExpense,
  getSingleExpenseByShop,
  updateExpenseById,
} from "../controllers/expenses";
import express from "express";

const expenseRouter = express.Router();

/**
 * @swagger
 * /api/v1/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     description: Creates a new expense in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 */
expenseRouter.post("/expenses", createExpense);

/**
 * @swagger
 * /api/v1/expenses:
 *   get:
 *     summary: Retrieve a list of expenses
 *     tags: [Expenses]
 *     description: Retrieve a list of expenses from the database.
 *     responses:
 *       200:
 *         description: A list of expenses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 */
expenseRouter.get("/expenses", getExpenses);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   get:
 *     summary: Retrieve a single expense by ID
 *     tags: [Expenses]
 *     description: Retrieve a single expense from the database by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The expense ID
 *     responses:
 *       200:
 *         description: A single expense.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Expense not found
 */
expenseRouter.get("/expenses/:id", getSingleExpense);
expenseRouter.get("/expenses/shop/:shopId", getSingleExpenseByShop);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   put:
 *     summary: Update an expense by ID
 *     tags: [Expenses]
 *     description: Update an expense in the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The expense ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Expense not found
 */
expenseRouter.put("/expenses/:id", updateExpenseById);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     tags: [Expenses]
 *     description: Delete an expense from the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The expense ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Expense not found
 */
expenseRouter.delete("/expenses/:id", deleteExpenseById);

export default expenseRouter;
