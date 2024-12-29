import express from "express";
import {
  createPayee,
  deletePayeeById,
  getPayees,
  getSinglePayee,
  updatePayeeById,
} from "../controllers/payee";

const payeeRouter = express.Router();

/**
 * @swagger
 * /api/v1/payees:
 *   post:
 *     summary: Create a new payee
 *     tags: [Payees]
 *     description: Creates a new payee in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payee'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payee'
 */
payeeRouter.post("/payees", createPayee);

/**
 * @swagger
 * /api/v1/payees:
 *   get:
 *     summary: Retrieve a list of payees
 *     tags: [Payees]
 *     description: Retrieve a list of payees from the database.
 *     responses:
 *       200:
 *         description: A list of payees.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payee'
 */
payeeRouter.get("/payees", getPayees);

/**
 * @swagger
 * /api/v1/payees/{id}:
 *   get:
 *     summary: Retrieve a single payee by ID
 *     tags: [Payees]
 *     description: Retrieve a single payee from the database by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payee ID
 *     responses:
 *       200:
 *         description: A single payee.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payee'
 *       404:
 *         description: Payee not found
 */
payeeRouter.get("/payees/:id", getSinglePayee);

/**
 * @swagger
 * /api/v1/payees/{id}:
 *   put:
 *     summary: Update a payee by ID
 *     tags: [Payees]
 *     description: Update a payee in the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payee'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payee'
 *       404:
 *         description: Payee not found
 */
payeeRouter.put("/payees/:id", updatePayeeById);

/**
 * @swagger
 * /api/v1/payees/{id}:
 *   delete:
 *     summary: Delete a payee by ID
 *     tags: [Payees]
 *     description: Delete a payee from the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payee ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Payee not found
 */
payeeRouter.delete("/payees/:id", deletePayeeById);

export default payeeRouter;
