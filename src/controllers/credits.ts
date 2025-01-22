import { RequestHandler } from "express";
import { db } from "../db/db";

export const createCredit: RequestHandler = async (req, res) => {
  const {
    maxCreditLimit,
    maxCreditDays,
    unpaidCreditAmount,
    customerId,
    shopId,
  } = req.body;

  try {
    const existingCustomer = await db.credit.findFirst({
      where: {
        customerId,
      },
    });

    if (!existingCustomer) {
      res.status(409).json({
        data: null,
        error: "Customer not exists",
      });
      const newCustomer = await db.credit.create({
        data: {
          maxCreditLimit,
          maxCreditDays,
          unpaidCreditAmount,
          customerId,
          shopId,
        },
      });

      res.status(201).json({
        data: newCustomer,
        error: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
};

export const getCredits: RequestHandler = async (req, res) => {
  try {
    const customers = await db.credit.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      data: customers,
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

export const getSingleCredit: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await db.credit.findUnique({
      where: { id },
    });

    if (!customer) {
      res.status(404).json({
        data: null,
        error: "Customer not found",
      });
      return;
    }

    res.status(200).json({
      data: customer,
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

export const updateCreditById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { maxCreditLimit, maxCreditDays, unpaidCreditAmount } = req.body;

    const existingCredit = await db.credit.findUnique({
      where: {
        id,
      },
    });

    if (!existingCredit) {
      res.status(404).json({
        data: null,
        error: "Credit not found",
      });
      return;
    }

    const updatedCredit = await db.credit.update({
      where: {
        id,
      },
      data: {
        maxCreditLimit,
        maxCreditDays,
        unpaidCreditAmount,
      },
    });

    res.status(200).json({
      data: updatedCredit,
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

export const deleteCreditById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const credit = await db.credit.findUnique({
      where: {
        id,
      },
    });
    if (!credit) {
      res.status(404).json({
        data: null,
        error: "Credit not found",
      });
      return;
    }

    await db.credit.delete({
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
