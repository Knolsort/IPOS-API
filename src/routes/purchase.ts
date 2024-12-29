import express from "express";
import {
  createPurchaseOrder,
  getPurchaseOrders,
} from "../controllers/purchases";

const purchaseRouter = express.Router();

/**
 * @swagger
 * /api/v1/purchases:
 *   post:
 *     summary: Create a new purchase order
 *     tags: [Purchases]
 *     description: Creates a new purchase order in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseOrder'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseOrder'
 */
purchaseRouter.post("/purchases", createPurchaseOrder);

/**
 * @swagger
 * /api/v1/purchases:
 *   get:
 *     summary: Retrieve a list of purchase orders
 *     tags: [Purchases]
 *     description: Retrieve a list of purchase orders from the database.
 *     responses:
 *       200:
 *         description: A list of purchase orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseOrder'
 */
purchaseRouter.get("/purchases", getPurchaseOrders);

export default purchaseRouter;
