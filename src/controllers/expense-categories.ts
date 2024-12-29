import { RequestHandler } from "express";
import { db } from "../db/db";

export const createExpenseCategory: RequestHandler = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const existingCategory = await db.expenseCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      res.status(409).json({
        error: `Category ${name} already exists`,
        data: null,
      });
      return;
    }

    const newCategory = await db.expenseCategory.create({
      data: { name, slug },
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

export const getExpenseCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await db.expenseCategory.findMany({
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

export const getSingleExpenseCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingCategory = await db.expenseCategory.findUnique({
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

export const updateExpenseCategoryById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const existingCategory = await db.expenseCategory.findUnique({
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
      const existingCategoryBySlug = await db.expenseCategory.findUnique({
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

    const updatedExpenseCategory = await db.expenseCategory.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
      },
    });

    res.status(200).json({
      data: updatedExpenseCategory,
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

export const deleteExpenseCategoryById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await db.expenseCategory.findUnique({
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

    await db.expenseCategory.delete({
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
