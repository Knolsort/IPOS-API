import express from 'express';

import { createSale, createSaleItem, getSales, getShopSales, getShopSalesTotalAmounts, getShopsSales } from '../controllers/sales';

const saleRouter = express.Router();

/**
 * @swagger
 * /api/v1/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     description: Creates a new sale in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 */
saleRouter.post('/sales', createSale);

/**
 * @swagger
 * /api/v1/sales/item:
 *   post:
 *     summary: Create a new sale item
 *     tags: [Sales]
 *     description: Creates a new sale item in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleItem'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleItem'
 */
saleRouter.post('/sales/item', createSaleItem);

/**
 * @swagger
 * /api/v1/sales:
 *   get:
 *     summary: Retrieve a list of sales
 *     tags: [Sales]
 *     description: Retrieve a list of sales from the database.
 *     responses:
 *       200:
 *         description: A list of sales.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 */
saleRouter.get('/sales', getSales);

/**
 * @swagger
 * /api/v1/sales/shop/{shopId}:
 *   get:
 *     summary: Retrieve a list of sales for a specific shop
 *     tags: [Sales]
 *     description: Retrieve a list of sales for a specific shop from the database.
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         description: The shop ID
 *     responses:
 *       200:
 *         description: A list of sales.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Shop not found
 */
saleRouter.get('/sales/shop/:shopId', getShopSales);
saleRouter.get('/sales/total/:shopId', getShopSalesTotalAmounts);

/**
 * @swagger
 * /api/v1/sales/all-shops:
 *   get:
 *     summary: Retrieve a list of sales for all shops
 *     tags: [Sales]
 *     description: Retrieve a list of sales for all shops from the database.
 *     responses:
 *       200:
 *         description: A list of sales.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 */
saleRouter.get('/sales/all-shops', getShopsSales);

export default saleRouter;