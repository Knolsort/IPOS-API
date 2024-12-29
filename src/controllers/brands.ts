import { RequestHandler } from "express";
import { db } from "../db/db";

export const createBrand: RequestHandler = async (req, res) => {
  try {
    const { name, abbreviation, slug } = req.body;

    const existingBrand = await db.brand.findUnique({
      where: { slug },
    });

    if (existingBrand) {
      res.status(409).json({
        error: `Brand ${name} already exists`,
        data: null,
      });
      return
    }

    const newBrand = await db.brand.create({
      data: { name, slug },
    });

    res.status(201).json({
      data: newBrand,
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

export const getBrands: RequestHandler = async (req, res) => {
  try {
    const brands = await db.brand.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      data: brands,
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

export const getSingleBrand: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBrand = await db.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      res.status(404).json({
        data: null,
        error: "Brand does not exist",
      });
      return;
    }

    res.status(200).json({
      data: existingBrand,
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

export const updateBrandById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, abbreviation, slug } = req.body;

    const existingBrand = await db.brand.findUnique({
      where: {
        id,
      },
    });

    if (!existingBrand) {
      res.status(404).json({
        data: null,
        error: "Brand not found",
      });
      return;
    }
    if (slug && slug !== existingBrand.slug) {
      const existingBrandBySlug = await db.brand.findUnique({
        where: { slug },
      });

      if (existingBrandBySlug) {
        res.status(409).json({
          data: null,
          error: "Brand already exists",
        });
        return;
      }
    }

    const updatedBrand = await db.brand.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
      },
    });

    res.status(200).json({
      data: updatedBrand,
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

export const deleteBrandById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await db.brand.findUnique({
      where: {
        id,
      },
    });
    if (!brand) {
      res.status(404).json({
        data: null,
        error: "Brand not found",
      });
      return;
    }

    await db.brand.delete({
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
