import express from "express";
import {
  createNotification,
  deleteNotificationById,
  getNotifications,
  updateNotificationById,
} from "../controllers/notifications";

const notificationRouter = express.Router();

/**
 * @swagger
 * /api/v1/notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     description: Creates a new notification in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 */
notificationRouter.post("/notifications", createNotification);

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Retrieve a list of notifications
 *     tags: [Notifications]
 *     description: Retrieve a list of notifications from the database.
 *     responses:
 *       200:
 *         description: A list of notifications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
notificationRouter.get("/notifications", getNotifications);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   put:
 *     summary: Update a notification by ID
 *     tags: [Notifications]
 *     description: Update a notification in the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 */
notificationRouter.put("/notifications/:id", updateNotificationById);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   delete:
 *     summary: Delete a notification by ID
 *     tags: [Notifications]
 *     description: Delete a notification from the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Notification not found
 */
notificationRouter.delete("/notifications/:id", deleteNotificationById);

export default notificationRouter;
