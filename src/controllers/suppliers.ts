import { db } from "../db/db";
import { RequestHandler } from "express";

export const createSupplier: RequestHandler = async (req, res) => {
  const { name, phone, contactPerson } = req.body;

  try {
    // Check if phone and email are unique
    const existingSupplierByPhone = await db.supplier.findUnique({
      where: { phone },
    });

    if (existingSupplierByPhone) {
      res.status(409).json({
        error: `Phone number ${phone} is already in use`,
      });
      return;
    }

    // Create the supplier
    const newSupplier = await db.supplier.create({
      data: {
        name, phone, contactPerson
      },
    });

    res.status(201).json(newSupplier);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create supplier" });
  }
};

export const getSuppliers: RequestHandler = async (req, res) => {
  try {
    const suppliers = await db.supplier.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(suppliers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};

export const getSingleSupplier: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await db.supplier.findUnique({
      where: {
        id,
      },
    });

    if (!supplier) {
      res.status(404).json({ error: "Supplier not found" });
      return;
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch supplier" });
  }
};

export const getSupplierByPhone: RequestHandler = async (req, res) => {
  const { phone } = req.params;

  if (!phone || phone.length < 3) {
    res.status(400).json({
      data: null,
      error: "Please provide at least 3 characters of the phone number",
    });
  }

  try {
    const customers = await db.supplier.findMany({
      where: {
        phone: {
          startsWith: phone,
        },
      },
      take: 10,
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