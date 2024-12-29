import express from "express";
import { createAdjustment, getAdjustments } from "../controllers/adjustments";

const adjustmentRouter = express.Router();

/**
 * @swagger
 * /api/v1/adjustments:
 *   post:
 *     summary: Create a new adjustment
 *     tags: [Adjustments]
 *     description: Creates a new adjustment in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Adjustment'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Adjustment'
 */

adjustmentRouter.post("/adjustments", createAdjustment);

/**
 * @swagger
 * /api/v1/adjustments:
 *   get:
 *     summary: Retrieve a list of adjustments
 *     tags: [Adjustments]
 *     description: Retrieve a list of adjustments from the database.
 *     responses:
 *       200:
 *         description: A list of adjustments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Adjustment'
 */
adjustmentRouter.get("/adjustments", getAdjustments);

export default adjustmentRouter;
