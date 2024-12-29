import { authorizeUser, changePassword, forgetPassword, verifyToken } from "../controllers/login";
import express from "express";

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

/**
 * @swagger
 * /api/v1/auth/forget-password:
 *   put:
 *     summary: Forget password
 *     tags: [Auth]
 *     description: Request a password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPassword'
 *     responses:
 *       200:
 *         description: Password reset requested
 */
loginRouter.put("/auth/forget-password", forgetPassword);

/**
 * @swagger
 * /api/v1/auth/verify-token/{resetToken}:
 *   get:
 *     summary: Verify reset token
 *     tags: [Auth]
 *     description: Verify the password reset token.
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset token
 *     responses:
 *       200:
 *         description: Token verified
 *       404:
 *         description: Token not found
 */
loginRouter.get("/auth/verify-token/:resetToken", verifyToken);

/**
 * @swagger
 * /api/v1/auth/change-password/{resetToken}:
 *   put:
 *     summary: Change password
 *     tags: [Auth]
 *     description: Change the user's password using the reset token.
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Password changed
 *       404:
 *         description: Token not found
 */
loginRouter.put("/auth/change-password/:resetToken", changePassword);

export default loginRouter;
