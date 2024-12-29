import { RequestHandler } from "express";
import { db } from "../db/db";
import { generateSaleNumber } from "../utils/generateSaleNumber";
import { NotificationStatus, PurchaseOrderStatus } from "@prisma/client";

interface PurchaseOrderItem {
  purchaseOrderId: string;
  productId: string;
  quantity: number;
  productName: string;
  unitCost: number;
  subTotal: number;
  currentStock: number;
}

interface PurchaseOrderProps {
  supplierId: string;
  status: PurchaseOrderStatus;
  discount: number;
  notes: string;
  tax: number;
  totalAmount: number;
  balanceAmount: number;
  shippingCost: number;

  items: PurchaseOrderItem[];
}

export const createPurchaseOrder: RequestHandler = async (req, res) => {
  try {
    const {
      supplierId,
      status,
      discount,
      notes,
      tax,
      totalAmount,
      balanceAmount,
      shippingCost,
      items,
    }: PurchaseOrderProps = req.body;

    // Create Transaction
    const purchaseId = await db.$transaction(async (transaction) => {
      // Create Purchase Order
      const purchase = await transaction.purchaseOrder.create({
        data: {
          supplierId,
          status,
          discount,
          notes,
          tax,
          totalAmount,
          balanceAmount,
          shippingCost,
          refNo: generateSaleNumber(),
        },
      });

      // Use the Items
      for (const item of items) {
        // Update Product Stock
        const updatedProduct = await transaction.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stockQty: {
              increment: item.quantity,
            },
          },
        });

        if (!updatedProduct) {
          res.status(404).json({
            data: null,
            error: `Failed to update product stock for ${item.productId}`,
          });
          return;
        }

        //Send/Create Notification
        const message = `New Purchase Order for ${item.productName} has been created`;
        const statusText = "New Stock";
        const status: NotificationStatus = "INFO";

        const newNotification = {
          message,
          status,
          statusText,
        };

        const notification = await transaction.notification.create({
          data: newNotification,
        });

        // Create Purchase Order Item
        const purchaseItem = await transaction.purchaseOrderItem.create({
          data: {
            purchaseOrderId: purchase.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitCost: item.unitCost,
            subTotal: item.subTotal,
            currentStock: item.currentStock,
          },
        });
        if (!purchaseItem) {
          res.status(404).json({
            data: null,
            error: `Failed to create purchase order item for ${item.productId}`,
          });
          return;
        }
      }

      // Return Purchase Order ID
      return purchase.id;
    });

    const savedPurchaseOrder = await db.purchaseOrder.findUnique({
      where: {
        id: purchaseId,
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      data: savedPurchaseOrder,
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

export const getPurchaseOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await db.purchaseOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        supplier: true,
      },
    });

    res.status(200).json({
      data: orders,
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
