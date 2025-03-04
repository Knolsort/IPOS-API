import { RequestHandler } from "express";
import { db } from "../db/db";
import { sendOTPCode } from "../middleware/Email";

export const createUser: RequestHandler = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      res.status(400).json({
        error: "Missing required fields",
        data: null,
      });
    }


    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
      include: {
        shops: true,
      },
    });


    if (!existingUser) {
      const newUser = await db.user.create({
        data: {
          firstName,
          lastName,
          email
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
      include: {
        shops: true,
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
    const { firstName, lastName, email } = req.body;

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

    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        email
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

export const otpSend: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log("OTP : ", otp)

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "User not found",
        data: null,
      });
    }

    if (user) {
      const otp = Math.floor(1000 + Math.random() * 9000);
      user.password = otp.toString();
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: otp.toString(),
        },
      });
      await sendOTPCode(email, otp.toString());
    }

    res.status(200).json({
      data: "OTP sent successfully",
      error: null,
    });
  } catch (error) {
    console.error("OTP sending error:", error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}

export const otpVerify: RequestHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await db.user.findUnique({
      where: {
        email,
      },
      include: {
        shops: true,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "User not found",
        data: null,
      });
    }

    if (user?.password === otp) {
      res.status(200).json({
        data: user,
        error: null,
      });
    } else {
      res.status(400).json({
        error: "Invalid OTP",
        data: null,
      });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}