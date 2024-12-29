import {
  createUnit,
  deleteUnitById,
  getSingleUnit,
  getUnits,
  updateUnitById,
} from "../controllers/units";
import express from "express";

const unitRouter = express.Router();

/**
 * @swagger
 * /api/v1/units:
 *   post:
 *     summary: Create a new unit
 *     tags: [Units]
 *     description: Creates a new unit in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unit'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 */
unitRouter.post("/units", createUnit);

/**
 * @swagger
 * /api/v1/units:
 *   get:
 *     summary: Retrieve a list of units
 *     tags: [Units]
 *     description: Retrieve a list of units from the database.
 *     responses:
 *       200:
 *         description: A list of units.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Unit'
 */
unitRouter.get("/units", getUnits);

/**
 * @swagger
 * /api/v1/units/{id}:
 *   get:
 *     summary: Retrieve a single unit by ID
 *     tags: [Units]
 *     description: Retrieve a single unit from the database by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unit ID
 *     responses:
 *       200:
 *         description: A single unit.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 *       404:
 *         description: Unit not found
 */
unitRouter.get("/units/:id", getSingleUnit);

/**
 * @swagger
 * /api/v1/units/{id}:
 *   put:
 *     summary: Update a unit by ID
 *     tags: [Units]
 *     description: Update a unit in the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unit'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 *       404:
 *         description: Unit not found
 */
unitRouter.put("/units/:id", updateUnitById);

/**
 * @swagger
 * /api/v1/units/{id}:
 *   delete:
 *     summary: Delete a unit by ID
 *     tags: [Units]
 *     description: Delete a unit from the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unit ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Unit not found
 */
unitRouter.delete("/units/:id", deleteUnitById);

export default unitRouter;
