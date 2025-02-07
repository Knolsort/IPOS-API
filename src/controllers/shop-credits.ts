import { RequestHandler } from "express";
import { db } from "../db/db";

interface ShopCreditProps {
  title: string;
  maxCreditDays?: number;
  unpaidCreditAmount: number;
  supplierId?: string;
  shopId: string;
}

export const createShopCredit: RequestHandler = async (req, res) => {
  try {
    const {
      title,
      maxCreditDays,
      supplierId,
      shopId,
      unpaidCreditAmount,
    }: ShopCreditProps = req.body;

    const shop = await db.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      res.status(404).json({
        data: null,
        error: "Shop not found",
      });
    }

    if (supplierId) {
      const supplier = await db.supplier.findUnique({
        where: { id: supplierId },
      });

      if (!supplier) {
        res.status(404).json({
          data: null,
          error: "Supplier not found",
        });
      }
    }

    // Create shop credit
    const shopCredit = await db.shopCredit.create({
      data: {
        title,
        maxCreditDays,
        supplierId,
        shopId,
        unpaidCreditAmount,
      },
    });

    res.status(201).json({
      data: shopCredit,
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

export const getShopCredits: RequestHandler = async (req, res) => {
  try {
    const shopCredits = await db.shopCredit.findMany({
      include: {
        shop: true,
        supplier: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      data: shopCredits,
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

export const updateShopCredit: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, maxCreditDays, unpaidCreditAmount } = req.body;

    const updatedShopCredit = await db.shopCredit.update({
      where: { id },
      data: {
        title,
        maxCreditDays,
        unpaidCreditAmount,
      },
    });

    res.status(200).json({
      data: updatedShopCredit,
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

export const getShopCreditById: RequestHandler = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shopCredit = await db.shopCredit.findMany({
      where: { shopId },
      include: {
        shop: true,
        supplier: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!shopCredit) {
      res.status(404).json({
        data: null,
        error: "Shop credit not found",
      });
    }

    res.status(200).json({
      data: shopCredit,
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

export const deleteShopCredit: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await db.shopCredit.delete({
      where: { id },
    });

    res.status(200).json({
      data: "Shop credit deleted successfully",
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
