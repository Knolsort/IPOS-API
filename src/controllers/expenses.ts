import { RequestHandler } from "express";
import { db } from "../db/db";

export const createExpense: RequestHandler = async (req, res) => {
  try {
    const {
      title,
      amount,
      description,
      attachments,
      payeeId,
      categoryId,
      shopId,
    } = req.body;

    const newExpense = await db.expense.create({
      data: {
        title,
        amount,
        description,
        attachments,
        payeeId,
        categoryId,
        shopId,
      },
    });

    res.status(201).json({
      data: newExpense,
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

export const getExpenses: RequestHandler = async (req, res) => {
  try {
    const expenses = await db.expense.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      data: expenses,
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

export const getSingleExpense: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingExpense = await db.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      res.status(404).json({
        data: null,
        error: "Expense does not exist",
      });
    }

    res.status(200).json({
      data: existingExpense,
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
export const getSingleExpenseByShop: RequestHandler = async (req, res) => {
  try {
    const { shopId } = req.params;
    const existingExpenseByShop = await db.expense.findMany({
      where: { shopId },
      include: {
        category: true
      },
      orderBy: {createdAt: "desc"}
    });

    if (!existingExpenseByShop) {
      res.status(404).json({
        data: null,
        error: "No expense created yet",
      });
    }

    res.status(200).json({
      data: existingExpenseByShop,
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


export const updateExpenseById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      amount,
      description,
      attachments,
      expenseDate,
      payeeId,
      categoryId,
      shopId,
    } = req.body;

    const existingExpense = await db.expense.findUnique({
      where: {
        id,
      },
    });

    if (!existingExpense) {
      res.status(404).json({
        data: null,
        error: "Expense not found",
      });
    }

    const updatedExpense = await db.expense.update({
      where: {
        id,
      },
      data: {
        title,
        amount,
        description,
        attachments,
        payeeId,
        categoryId,
        shopId,
      },
    });

    res.status(200).json({
      data: updatedExpense,
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

export const deleteExpenseById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await db.expense.findUnique({
      where: {
        id,
      },
    });
    if (!expense) {
      res.status(404).json({
        data: null,
        error: "Expense not found",
      });
    }

    await db.expense.delete({
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
