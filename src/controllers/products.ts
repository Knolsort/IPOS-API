import { RequestHandler } from "express";
import { db } from "../db/db";

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const {
      gproductId,
      barcode,
      alertQty,
      stockQty,
      price,
      offerPrice,
      sku,
      supplierId,
      shopId,
      expiryDate,
    } = req.body;

    // Validate required fields
    if (!gproductId || !shopId) {
      res.status(400).json({
        error: "gproductId and shopId are required",
        data: null,
      });
    }

    const existingProductByGProductId = await db.product.findUnique({
      where: gproductId,
    });

    if (existingProductByGProductId) {
      res.status(409).json({
        error: `Product with gproductId ${gproductId} already exists in shop ${shopId}`,
        data: null,
      });
    }

    const existingProductBySKU = await db.product.findUnique({
      where: { sku },
    });

    if (existingProductBySKU) {
      res.status(409).json({
        error: `Product SKU ${sku} already exists`,
        data: null,
      });
      return;
    }

    if (barcode) {
      const existingProductByBarcode = await db.product.findUnique({
        where: { barcode },
      });

      if (existingProductByBarcode) {
        res.status(409).json({
          error: `Product Barcode ${barcode} already exists`,
          data: null,
        });
        return;
      }
    }

    const newProduct = await db.product.create({
      data: {
        gproductId,
        barcode,
        alertQty,
        stockQty,
        price,
        offerPrice,
        sku,
        supplierId,
        shopId,
        expiryDate,
      },
    });

    res.status(201).json({
      data: newProduct,
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

export const getProducts: RequestHandler = async (req, res) => {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        gproduct: true,
      },
    });

    res.status(200).json({
      data: products,
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

export const getSingleProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({
        data: null,
        error: "Product does not exist",
      });
      return;
    }

    res.status(200).json({
      data: existingProduct,
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

export const updateProductById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      gproductId,
      barcode,
      alertQty,
      stockQty,
      price,
      offerPrice,
      sku,
      supplierId,
      shopId,
      expiryDate,
    } = req.body;

    const existingProduct = await db.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      res.status(404).json({
        data: null,
        error: "Product not found",
      });
      return;
    }

    if (sku && sku !== existingProduct.sku) {
      const existingProductBySKU = await db.product.findUnique({
        where: { sku },
      });

      if (existingProductBySKU) {
        res.status(409).json({
          data: null,
          error: `Product SKU ${sku} already exists`,
        });
        return;
      }
    }

    if (barcode && barcode !== existingProduct.barcode) {
      const existingProductByBarcode = await db.product.findUnique({
        where: { barcode },
      });

      if (existingProductByBarcode) {
        res.status(409).json({
          data: null,
          error: `Product Barcode ${barcode} already exists`,
        });
        return;
      }
    }

    const updatedProduct = await db.product.update({
      where: {
        id,
      },
      data: {
        gproductId,
        barcode,
        alertQty,
        stockQty,
        price,
        offerPrice,
        sku,
        supplierId,
        shopId,
        expiryDate,
      },
    });

    res.status(200).json({
      data: updatedProduct,
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

export const deleteProductById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      res.status(404).json({
        data: null,
        error: "Product not found",
      });
      return;
    }

    await db.product.delete({
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
