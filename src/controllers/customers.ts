import { RequestHandler } from "express";
import { db } from "../db/db";

export const createCustomer: RequestHandler = async (req, res) => {
  const { name, phone, image } = req.body;

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
        image,
        phone,
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

export const getCustomerSuggestions: RequestHandler = async (req, res) => {
  const { phone } = req.params;

  if (!phone || phone.length < 3) {
    res.status(400).json({
      data: null,
      error: "Please provide at least 3 characters of the phone number",
    });
  }

  try {
    const customers = await db.customer.findMany({
      where: {
        phone: {
          startsWith: phone,
        },
      },
      take: 10, // Limit the number of suggestions for performance
    });

    res.status(200).json({
      data: customers,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
};
