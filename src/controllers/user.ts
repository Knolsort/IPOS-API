import { RequestHandler } from "express";
import { db } from "../db/db";
import bcrypt from "bcrypt";

export const createUser: RequestHandler = async (req, res) => {
  const { username, name, phone } = req.body;

  try {
    // Check if user already exists phone
    const existingUserByPhone = await db.user.findUnique({
      where: {
        phone,
      },
    });
    if (existingUserByPhone) {
      res.status(401).json({
        error: `Phone Number (${phone}) is already taken`,
        data: null,
      });
      return;
    }

    //Crete user
    const newUser = await db.user.create({
      data: {
        username,
        name,
        phone,
      },
    });
    res.status(201).json({
      data: newUser,
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

export const getUser: RequestHandler = async (req, res) => {
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
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      res.status(404).json({
        data: null,
        error: "User not found",
      });
    } else {
      res.status(200).json({
        data: user,
        error: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};

export const updateUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, name, phone } = req.body;

    // Existing user
    const existingUser = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        data: null,
        error: "User not found",
      });
      return;
    }

    if (phone && phone !== existingUser.phone) {
      const existingUserByPhone = await db.user.findUnique({
        where: {
          phone,
        },
      });
      if (existingUserByPhone) {
        res.status(401).json({
          error: `Phone Number (${phone}) is already taken`,
          data: null,
        });
        return;
      }
    }

    if (username && username !== existingUser.username) {
      const existingUserByUsername = await db.user.findUnique({
        where: {
          username,
        },
      });
      if (existingUserByUsername) {
        res.status(401).json({
          error: `Username (${username}) is already taken`,
          data: null,
        });
        return;
      }
    }

    //Update user
    const updateUser = await db.user.update({
      where: {
        id,
      },
      data: {
        username,
        name,

        phone,
      },
    });

    //return update user without password
    res.status(200).json({
      data: updateUser,
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

export const deleteUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      res.status(404).json({
        data: null,
        error: "User not found",
      });
    } else {
      await db.user.delete({
        where: {
          id,
        },
      });
      res.status(200).json({
        success: true,
        error: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};
