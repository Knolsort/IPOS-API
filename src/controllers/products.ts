import { RequestHandler } from "express";
import { db } from "../db/db";
import { basename } from "path";

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      description,
      batchNumber,
      barcode,
      image,
      gst,
      alertQty,
      stockQty,
      price,
      sku,
      productCode,
      slug,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
      shopId,
    } = req.body;

    //Check if product already exists
    const existingProductBySlug = await db.product.findUnique({
      where: { slug },
    });

    if (existingProductBySlug) {
      res.status(409).json({
        error: `Product ${name} already exists`,
        data: null,
      });
      return;
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
    const existingProductByProductCode = await db.product.findUnique({
      where: { sku },
    });

    if (existingProductByProductCode) {
      res.status(409).json({
        error: `Product Code ${productCode} already exists`,
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
        name,
        description,
        batchNumber,
        barcode,
        image,
        gst,
        alertQty,
        stockQty,
        price,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,
        shopId,
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
      name,
      description,
      batchNumber,
      barcode,
      image,
      gst,
      alertQty,
      stockQty,
      price,
      sku,
      productCode,
      slug,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
      shopId,
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
    // if slug,barcode,sku,productCode are unique
    if (slug && slug !== existingProduct.slug) {
      const existingProductBySlug = await db.product.findUnique({
        where: { slug },
      });

      if (existingProductBySlug) {
        res.status(409).json({
          data: null,
          error: `Product ${name} already exists`,
        });
        return;
      }
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
    if (productCode && productCode !== existingProduct.productCode) {
      const existingProductByProductCode = await db.product.findUnique({
        where: { productCode },
      });

      if (existingProductByProductCode) {
        res.status(409).json({
          data: null,
          error: `Product Code ${productCode} already exists`,
        });
        return;
      }
    }

    const updatedProduct = await db.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        batchNumber,
        barcode,
        image,
        gst,
        alertQty,
        stockQty,
        price,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,
        shopId,
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
