import { RequestHandler } from "express";
import { db } from "../db/db";
import { clerkClient } from "@clerk/express";

export const createUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("userId", userId);
    if (!userId) {
      res.status(401).json({
        error: "Unauthorized",
        data: null,
      });
    }

    // Check if user already exist
    const existingUser = await db.user.findUnique({
      where: {
        userId,
      },
    });
    // Get user data from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const firstName = clerkUser.firstName || "";
    const lastName = clerkUser.lastName || "";

    console.log("firstName", firstName);

    if (!existingUser) {
      const newUser = await db.user.create({
        data: {
          firstName,
          lastName,
          email,
          userId,
        },
      });
    
      res.status(201).json({
        data: newUser,
        error: null,
      });
    } else {
      res.status(200).json({
        data: existingUser,
        error: null,
      });
    }
      
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      data: users,
      error: null,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      data: user,
      error: null,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};

export const updateUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, userId } = req.body;

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        error: "User not found",
        data: null,
      });
    }

    // Verify user is updating their own profile
    if (existingUser?.userId !== userId) {
      res.status(403).json({
        error: "Not authorized to update this user",
        data: null,
      });
    }

    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
      },
    });

    res.status(200).json({
      data: updatedUser,
      error: null,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};

export const deleteUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "User not found",
        data: null,
      });
    }

    // Verify user is deleting their own profile
    if (user?.userId !== userId) {
      res.status(403).json({
        error: "Not authorized to delete this user",
        data: null,
      });
    }

    await db.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      data: "User deleted successfully",
      error: null,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};
