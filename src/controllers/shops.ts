import { RequestHandler } from "express";
import { db } from "../db/db";

export const createShop: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      slug,
      phone,
      location,
      latitude,
      longitude,
      gst,
      logo,
      adminId,
      attendantEmail,
    } = req.body;

    const existingShop = await db.shop.findUnique({
      where: { slug },
    });

    if (existingShop) {
      res.status(409).json({
        error: `Shop ${name} already existing`,
        data: null,
      });
      return;
    }

    const newShop = await db.shop.create({
      data: {
        name,
        slug,
        phone,
        location,
        latitude,
        longitude,
        gst,
        logo,
        adminId,
        attendantEmail,
      },
    });

    res.status(201).json({
      data: newShop,
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

export const getShops: RequestHandler = async (req, res) => {
  try {
    const shops = await db.shop.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      data: shops,
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

export const getShopAttendants: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingShop = await db.shop.findUnique({
      where: { id },
    });

    if (!existingShop) {
      res.status(404).json({
        data: null,
        error: "Shop does not exist",
      });
      return;
    }

    const attendants = await db.shop.findMany({
      where: {
        id: {
          in: existingShop.attendantEmail,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      data: attendants,
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

export const getSingleShop: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingShop = await db.shop.findUnique({
      where: { id },
    });

    if (!existingShop) {
      res.status(404).json({
        data: null,
        error: "Shop does not exist",
      });
      return;
    }

    res.status(200).json({
      data: existingShop,
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
