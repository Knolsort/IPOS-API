import { RequestHandler } from "express";
import { db } from "../db/db";

export const createGProduct: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      otherNames,
      description,
      image,
      gst,
      productCode,
      slug,
      assured,
      shopId,
      unitTypes,
      brandId,
      categoryId,
    } = req.body;

    // Validate required fields
    if (!name || !productCode || !slug || !categoryId) {
      res.status(400).json({
        error: "Name, productCode, slug, and categoryId are required.",
        data: null,
      });
    }

    // Determine the createrId
    const createrId = shopId || "admin"; // Use shopId if provided, otherwise default to 'admin'

    // Check for unique fields
    const existingProductCode = await db.gProduct.findUnique({
      where: { productCode },
    });
    if (existingProductCode) {
      res.status(409).json({
        error: `Product Code ${productCode} already exists.`,
        data: null,
      });
    }

    const existingSlug = await db.gProduct.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      res.status(409).json({
        error: `Slug ${slug} already exists.`,
        data: null,
      });
    }

    // Create the GProduct
    const newGProduct = await db.gProduct.create({
      data: {
        name,
        otherNames,
        description,
        image,
        gst,
        productCode,
        slug,
        assured,
        createrId,
        brandId,
        unitTypes,
        categoryId,
      },
    });

    res.status(201).json({
      data: newGProduct,
      error: null,
    });
  } catch (error) {
    console.error("Error creating GProduct:", error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
};

export const getGProducts: RequestHandler = async (req, res) => {
  try {
    const products = await db.gProduct.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        brand: true
      }
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

export const getSingleGProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await db.gProduct.findUnique({
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

export const updateGProductById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      otherNames,
      description,
      image,
      gst,
      productCode,
      slug,
      assured,
      shopId,
      unitTypes,
      brandId,
      categoryId,
    } = req.body;

    const existingProduct = await db.gProduct.findUnique({
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

    const createrId = shopId || "admin";

    // if slug,barcode,sku,productCode are unique
    if (slug && slug !== existingProduct.slug) {
      const existingProductBySlug = await db.gProduct.findUnique({
        where: slug,
      });

      if (existingProductBySlug) {
        res.status(409).json({
          data: null,
          error: `Product ${name} already exists`,
        });
        return;
      }
    }

    if (productCode && productCode !== existingProduct.productCode) {
      const existingProductByProductCode = await db.gProduct.findUnique({
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

    const updatedProduct = await db.gProduct.update({
      where: {
        id,
      },
      data: {
        name,
        otherNames,
        description,
        image,
        gst,
        productCode,
        slug,
        assured,
        createrId,
        brandId,
        unitTypes,
        categoryId,
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

export const deleteGProductById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.gProduct.findUnique({
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

    await db.gProduct.delete({
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
