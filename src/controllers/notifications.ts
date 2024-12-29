import { RequestHandler } from "express";
import { db } from "../db/db";

export const createNotification: RequestHandler = async (req, res) => {
  try {
    const { message, status, statusText, read } = req.body;

    const newNotification = await db.notification.create({
      data: { message, status, statusText, read },
    });

    res.status(201).json({
      data: newNotification,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
};

export const getNotifications: RequestHandler = async (req, res) => {
  try {
    const notifications = await db.notification.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      data: notifications,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
};

export const getSingleNotification: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingNotification = await db.notification.findUnique({
      where: { id },
    });

    if (!existingNotification) {
      res.status(404).json({
        data: null,
        error: "Notification does not exist",
      });
    }

    res.status(200).json({
      data: existingNotification,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
};

export const updateNotificationById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    const existingNotification = await db.notification.findUnique({
      where: {
        id,
      },
    });

    if (!existingNotification) {
      res.status(404).json({
        data: null,
        error: "Notification not found",
      });
    }

    const updatedNotification = await db.notification.update({
      where: {
        id,
      },
      data: {
        read,
      },
    });

    res.status(200).json({
      data: updatedNotification,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};

export const deleteNotificationById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await db.notification.findUnique({
      where: {
        id,
      },
    });
    if (!notification) {
      res.status(404).json({
        data: null,
        error: "Notification not found",
      });
    }

    await db.notification.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      success: true,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};
