import { RequestHandler } from "express";
import { db } from "../db/db";
import { generateSaleNumber } from "../utils/generateSaleNumber";
import { NotificationStatus } from "@prisma/client";

interface AdjustmentItem {
  adjustmentId: string;
  productId: string;
  quantity: number;
  type: string;
  currentStock: number;
  productName: string;
}

interface AdjustmentProps {
  reason: string;
  items: AdjustmentItem[];
}

export const createAdjustment: RequestHandler = async (req, res) => {
  try {
    const { reason, items }: AdjustmentProps = req.body;

    // Create Transaction
    const adjustmentId = await db.$transaction(async (transaction) => {
      // Create Adjustment
      const adjustment = await transaction.adjustment.create({
        data: {
          reason,
          refNo: generateSaleNumber(),
        },
      });

      // Use the Items
      for (const item of items) {
        // Update Product Stock
        let query;
        if (item.type === "addition") {
          query = {
            increment: item.quantity,
          };
        } else if (item.type === "subtraction") {
          query = {
            decrement: item.quantity,
          };
        }

        const updatedProduct = await transaction.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stockQty: query,
          },
        });

        if (!updatedProduct) {
          res.status(404).json({
            data: null,
            error: `Failed to update product stock for ${item.productId}`,
          });
          return;
        }

        if (updatedProduct.stockQty < updatedProduct.alertQty) {
          //Create notification if stock is low
          const message =
            updatedProduct.stockQty === 0
              ? `The stock of ${updatedProduct.sku} is out of stock. Curent stock is ${updatedProduct.stockQty}`
              : `The stock of ${updatedProduct.sku} is low. Curent stock is ${updatedProduct.stockQty}`;
          const statusText =
            updatedProduct.stockQty === 0 ? "Out of Stock" : "Low Stock";
          const status: NotificationStatus =
            updatedProduct.stockQty === 0 ? "DANGER" : "WARNING";

          const newNotification = {
            message,
            status,
            statusText,
          };
          await db.notification.create({
            data: newNotification,
          });
        }
        // Create Adjustment Item
        const adjustmentItem = await transaction.adjustmentItem.create({
          data: {
            adjustmentId: adjustment.id,
            productId: item.productId,
            productName: item.productName,
            currentStock: item.currentStock,
            quantity: item.quantity,
            type: item.type,
          },
        });
        if (!adjustmentItem) {
          res.status(404).json({
            data: null,
            error: `Failed to create adjustment item for ${item.productId}`,
          });
          return;
        }
        // Return Adjustment ID
        return adjustment.id;
      }
    });

    const savedAdjustment = await db.adjustment.findUnique({
      where: {
        id: adjustmentId,
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      data: savedAdjustment,
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

export const getAdjustments: RequestHandler = async (req, res) => {
  try {
    const adjustments = await db.adjustment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });

    res.status(200).json({
      data: adjustments,
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
