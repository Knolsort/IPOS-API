import { RequestHandler } from "express";
import { db } from "../db/db";

import { clerkClient } from "@clerk/express";

export const authorizeUser: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const existingUser = await db.user.findUnique({
      where: {
        userId,
      },
    });

    if (!existingUser) {
      res.status(403).json({ error: "User not found" });
      return;
    }

    // Get user data from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (email !== existingUser.email) {
      res.status(403).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      data: existingUser,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to authorize user" });
  }
};
