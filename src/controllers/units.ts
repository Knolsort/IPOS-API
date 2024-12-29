import { RequestHandler } from "express";
import { db } from "../db/db";

export const createUnit: RequestHandler = async (req, res) => {
  try {
    const { name, abbreviation, slug } = req.body;

    const existingUnit = await db.unit.findUnique({
      where: { slug },
    });

    if (existingUnit) {
      res.status(409).json({
        error: `Unit ${name} already exists`,
        data: null,
      });
      return;
    }

    const newUnit = await db.unit.create({
      data: { name, slug, abbreviation },
    });

    res.status(201).json({
      data: newUnit,
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

export const getUnits: RequestHandler = async (req, res) => {
  try {
    const units = await db.unit.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      data: units,
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

export const getSingleUnit: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUnit = await db.unit.findUnique({
      where: { id },
    });

    if (!existingUnit) {
      res.status(404).json({
        data: null,
        error: "Unit does not exist",
      });
      return;
    }

    res.status(200).json({
      data: existingUnit,
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

export const updateUnitById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, abbreviation, slug } = req.body;

    // Existing user
    const existingUnit = await db.unit.findUnique({
      where: {
        id,
      },
    });

    if (!existingUnit) {
      res.status(404).json({
        data: null,
        error: "Unit not found",
      });
      return;
    }
    if (slug && slug !== existingUnit.slug) {
      const existingUnitBySlug = await db.unit.findUnique({
        where: { slug },
      });

      if (existingUnitBySlug) {
        res.status(409).json({
          data: null,
          error: "Unit already exists",
        });
        return;
      }
    }
    //Update unit
    const updatedUnit = await db.unit.update({
      where: {
        id,
      },
      data: {
        name,
        abbreviation,
        slug,
      },
    });

    res.status(200).json({
      data: updatedUnit,
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

export const deleteUnitById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const unit = await db.unit.findUnique({
      where: {
        id,
      },
    });
    if (!unit) {
      res.status(404).json({
        data: null,
        error: "Unit not found",
      });
      return;
    }

    await db.unit.delete({
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
