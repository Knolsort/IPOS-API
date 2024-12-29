import { RequestHandler } from "express";
import { db } from "../db/db";

export const createCustomer: RequestHandler = async (req, res) => {
  const { name, phone, maxCreditLimit, maxCreditDays } = req.body;

  try {
    // Check if phone unique
    const existingCustomerByPhone = await db.customer.findUnique({
      where: { phone },
    });

    if (existingCustomerByPhone) {
      res.status(409).json({
        error: `Phone number ${phone} is already in use`,
      });
      return;
    }

    const newCustomer = await db.customer.create({
      data: {
        name,
        phone,
        maxCreditLimit,
        maxCreditDays,
      },
    });

    res.status(201).json({
      data: newCustomer,
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

export const getCustomers: RequestHandler = async (req, res) => {
  try {
    const customers = await db.customer.findMany({
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

export const getSingleCustomer: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await db.customer.findUnique({
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
