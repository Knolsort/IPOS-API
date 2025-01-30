import { RequestHandler } from "express";
import { db } from "../db/db";
import { generateSaleNumber } from "../utils/generateSaleNumber";
import { SaleRequestBody } from "../types/types";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
} from "date-fns";

export const createSale: RequestHandler = async (req, res) => {
  const {
    customerId,
    saleAmount,
    balanceAmount,
    paidAmount,
    saleType,
    paymentMethod,
    shopId,
    transactionCode,
    saleItems,
  }: SaleRequestBody = req.body;

  try {
    const saleId = await db.$transaction(async (transaction) => {
      // Create the Sale

      if (balanceAmount > 0) {
        // Check if the customer has enough credit limit
        const existingCredit = await transaction.credit.findFirst({
          where: {
            shopId,
            customerId,
          },
        });
        if (!existingCredit) {
          return res.status(404).json({
            error: "Customer Credit not found for this shop",
            data: null,
          });
        }
        if (balanceAmount > existingCredit?.maxCreditLimit) {
          return res.status(403).json({
            error: `This Customer not eligible for this Credit ${balanceAmount}`,
            data: null,
          });
        }
        // Update the customer unpaidAmount
        // Update the customer  MaxCreditAmount
        const updatedCustomer = await transaction.credit.update({
          where: {
            id: existingCredit.id,
          },

          data: {
            unpaidCreditAmount: {
              increment: balanceAmount,
              // existingCustomer.unpaidCreditAmount + balanceAmount,
            },
            maxCreditLimit: {
              decrement: balanceAmount,
            },
          },
        });
      }
      const sale = await transaction.sale.create({
        data: {
          customerId,
          paymentMethod,
          shopId,
          saleNumber: generateSaleNumber(),
          saleAmount,
          saleType,
          balanceAmount,
          paidAmount,
          transactionCode,
        },
      });
      if (saleItems?.length > 0) {
        for (const item of saleItems) {
          // Update Product stock quantity
          const updatedProduct = await transaction.product.update({
            where: { id: item.productId },
            data: {
              stockQty: {
                decrement: item.qty,
              },
            },
          });

          if (!updatedProduct) {
            return res.status(500).json({
              error: `Failed to update stock quantity for product ID: ${item.productId}`,
              data: null,
            });
          }

          // Create Line Order Item
          const saleItem = await transaction.saleItem.create({
            data: {
              saleId: sale.id,
              productId: item.productId,
              qty: item.qty,
              productPrice: item.productPrice,
              productName: item.productName,
              productImage: item.productImage,
            },
          });

          if (!saleItem) {
            return res.status(500).json({
              error: "Failed to Create Sale Item",
              data: null,
            });
          }
        }
      }
      return sale.id;
    });

    const sale = await db.sale.findUnique({
      where: {
        id: saleId as string,
      },
      include: {
        saleItems: true,
      },
    });
    // console.log(savedLineOrder);
    res.status(201).json(sale);
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ error: "Something went wrong", data: null });
  }
};

export const createSaleItem: RequestHandler = async (req, res) => {
  const { saleId, productId, qty, productPrice, productName, productImage } =
    req.body;

  try {
    // Update Product stock quantity
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        stockQty: {
          decrement: qty,
        },
      },
    });

    // Create Sale Item
    const saleItem = await db.saleItem.create({
      data: {
        saleId,
        productId,
        qty,
        productPrice,
        productName,
        productImage,
      },
    });

    res.status(201).json(saleItem);
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ error: "Something went wrong", data: null });
  }
};

export const getSales: RequestHandler = async (req, res) => {
  try {
    const brands = await db.sale.findMany({
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

export const getShopSales: RequestHandler = async (req, res) => {
  const { shopId } = req.params;

  if (!shopId) {
    res.status(400).json({
      error: "Please provide a shop ID",
      data: null,
    });
  }

  const exitingShop = await db.shop.findUnique({
    where: {
      id: shopId,
    },
  });
  if (!exitingShop) {
    res.status(404).json({
      error: `Shop with ID: ${shopId} not found`,
      data: null,
    });
  }
  // Define time periods
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  try {
    // Fetch sales for different periods
    const categorizeSales = async (sales: any[]) => {
      return {
        totalSales: sales,
        totalSalesAmount: sales.reduce((total, {saleAmount}) => total + (saleAmount || 0), 0), 
        salesPaidInCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
        salesPaidInCredit: sales.filter((sale) => sale.balanceAmount > 0),
        salesByMobileMoney: sales.filter(
          (sale) => sale.paymentMethod === "MOBILE_MONEY"
        ),
        salesByHandCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
      };
    };

    const salesToday = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        customer: true,
      },
    });

    const salesThisWeek = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        customer: true,
      },
    });

    const salesThisMonth = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        customer: true,
      },
    });

    const salesAllTime = await db.sale.findMany({
      where: {
        shopId,
      },
      include: {
        customer: true,
      },
    });

    res.status(200).json({
      today: await categorizeSales(salesToday),
      thisWeek: await categorizeSales(salesThisWeek),
      thisMonth: await categorizeSales(salesThisMonth),
      allTime: await categorizeSales(salesAllTime),
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

export const getShopsSales: RequestHandler = async (req, res) => {
  // Define time periods
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  try {
    // Fetch sales data with all necessary fields for categorization
    const fetchSalesData = async (startDate: Date, endDate: Date) => {
      return await db.sale.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          shopId: true,
          saleAmount: true,
          balanceAmount: true,
          paymentMethod: true,
          saleType: true,
        },
      });
    };
    const categorizeSales = (sales: any[]) => {
      return {
        totalSales: sales,
        salesPaidInCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
        salesPaidInCredit: sales.filter((sale) => sale.balanceAmount > 0),
        salesByMobileMoney: sales.filter(
          (sale) => sale.paymentMethod === "MOBILE_MONEY"
        ),
        salesByHandCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
      };
    };

    // Fetch and categorize sales data for each period
    const salesToday = await fetchSalesData(todayStart, todayEnd);
    const salesThisWeek = await fetchSalesData(weekStart, weekEnd);
    const salesThisMonth = await fetchSalesData(monthStart, monthEnd);
    const salesAllTime = await db.sale.findMany({
      select: {
        shopId: true,
        saleAmount: true,
        balanceAmount: true,
        paymentMethod: true,
        saleType: true,
      },
    });

    res.status(200).json({
      today: categorizeSales(salesToday),
      thisWeek: categorizeSales(salesThisWeek),
      thisMonth: categorizeSales(salesThisMonth),
      allTime: categorizeSales(salesAllTime),
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
