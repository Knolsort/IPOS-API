import express from "express";
import { authorizeUser } from "../controllers/login";

const loginRouter = express.Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authorize user
 *     tags: [Auth]
 *     description: Authorize a user and generate a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
loginRouter.post("/auth/login", authorizeUser);