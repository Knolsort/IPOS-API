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
      expiryDate,
    } = req.body;
    const { shopSlug } = req.params;

    // Validate required fields
    if (!gproductId || !shopSlug) {
      res.status(400).json({
        data: null,
      });
    }

    //Check if product already exists
    const existingProductByGproductId = await db.product.findFirst({
      where: { shopSlug, gproductId },
    });

    if (existingProductByGproductId) {
      res.status(409).json({
        error: `Product with gproductId ${gproductId} already exists in shop ${shopSlug}`,
        data: null,
      });
    }

    const existingProductBySKU = await db.product.findUnique({
      where: { shopSlug,sku },
      include: {
        shop: true
      }
    });

    if (existingProductBySKU) {
      res.status(409).json({
        error: `Product SKU ${sku} already exists`,
        data: null,
      });
      return;
    }

    // if (barcode) {
    //   const existingProductByBarcode = await db.gProduct.findUnique({
    //     where: { barcode },
    //   });

    //   if (existingProductByBarcode) {
    //     res.status(409).json({
    //       error: `Product Barcode ${barcode} already exists`,
    //       data: null,
    //     });
    //     return;
    //   }
    // }

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
        shopSlug,
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
  const { shopSlug } = req.params;
  try {
    const products = await db.product.findMany({
      where: {
        shopSlug,
      },
      orderBy: { createdAt: "desc" },
      include: {
        gproduct: {
          include: {
            brand: true,
            category: true,
          },
        },
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
    const { shopSlug, id } = req.params;
    const existingProduct = await db.product.findUnique({
      where: { id, shopSlug },
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
    const { shopSlug, id } = req.params;
    const {
      gproductId,
      barcode,
      alertQty,
      stockQty,
      price,
      offerPrice,
      sku,
      supplierId,
      expiryDate,
    } = req.body;

    const existingProduct = await db.product.findUnique({
      where: {
        id,
        shopSlug,
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
      const existingProductByBarcode = await db.gProduct.findUnique({
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
        shopSlug,
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
  const { id, shopSlug } = req.params;
  try {
    const product = await db.product.findUnique({
      where: {
        id,
        shopSlug,
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
