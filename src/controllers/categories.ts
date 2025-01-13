import { RequestHandler } from "express";
import { db } from "../db/db";

export const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name, slug, image } = req.body;

    const existingCategory = await db.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      res.status(409).json({
        error: `Category ${name} already exists`,
        data: null,
      });
      return;
    }

    const newCategory = await db.category.create({
      data: { name, slug, image },
    });

    res.status(201).json({
      data: newCategory,
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

export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await db.category.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      data: categories,
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

export const getSingleCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingCategory = await db.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      res.status(404).json({
        data: null,
        error: "Category does not exist",
      });
      return;
    }

    res.status(200).json({
      data: existingCategory,
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

export const updateCategoryById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, image } = req.body;

    const existingCategory = await db.category.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      res.status(404).json({
        data: null,
        error: "Category not found",
      });
      return;
    }
    if (slug && slug !== existingCategory.slug) {
      const existingCategoryBySlug = await db.category.findUnique({
        where: { slug },
      });

      if (existingCategoryBySlug) {
        res.status(409).json({
          data: null,
          error: "Category already exists",
        });
        return;
      }
    }

    const updatedCategory = await db.category.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
        image,
      },
    });

    res.status(200).json({
      data: updatedCategory,
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

export const deleteCategoryById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      res.status(404).json({
        data: null,
        error: "Category not found",
      });
      return;
    }

    await db.category.delete({
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
