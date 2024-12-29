import { RequestHandler } from "express";
import { db } from "../db/db";

export const createPayee: RequestHandler = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const existingPayee = await db.payee.findUnique({
      where: { phone },
    });

    if (existingPayee) {
      res.status(409).json({
        error: `Payee with phone number ${phone} already exists`,
        data: null,
      });
    }

    const newPayee = await db.payee.create({
      data: { name, phone },
    });

    res.status(201).json({
      data: newPayee,
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

export const getPayees: RequestHandler = async (req, res) => {
  try {
    const payees = await db.payee.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      data: payees,
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

export const getSinglePayee: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingPayee = await db.payee.findUnique({
      where: { id },
    });

    if (!existingPayee) {
      res.status(404).json({
        data: null,
        error: "Payee does not exist",
      });
    }

    res.status(200).json({
      data: existingPayee,
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

export const updatePayeeById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    const existingPayee = await db.payee.findUnique({
      where: {
        id,
      },
    });

    if (!existingPayee) {
      res.status(404).json({
        data: null,
        error: "Payee not found",
      });
    }

    if (phone && phone !== existingPayee?.phone) {
      const existingPayeeByPhone = await db.payee.findUnique({
        where: { phone },
      });

      if (existingPayeeByPhone) {
        res.status(409).json({
          data: null,
          error: `Payee with phone number ${phone} already exists`,
        });
      }
    }

    const updatedPayee = await db.payee.update({
      where: {
        id,
      },
      data: {
        name,
        phone,
      },
    });

    res.status(200).json({
      data: updatedPayee,
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

export const deletePayeeById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const payee = await db.payee.findUnique({
      where: {
        id,
      },
    });
    if (!payee) {
      res.status(404).json({
        data: null,
        error: "Payee not found",
      });
    }

    await db.payee.delete({
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
