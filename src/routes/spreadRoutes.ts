// src/routes/spreadRoutes.ts
import { Router } from 'express'
import * as spreadController from '@/controllers/spreadController'
const router = Router()

/**
 * @swagger
 * /api/spread/{market}:
 *   get:
 *     summary: Get spread for a specific market
 *     description: Retrieve the spread information for a given market
 *     tags: [Spreads]
 *     parameters:
 *       - in: path
 *         name: market
 *         required: true
 *         schema:
 *           type: string
 *         description: Market identifier (e.g., BTC-CLP)
 *       - in: query
 *         name: save
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Whether to save the spread value
 *     responses:
 *       200:
 *         description: Spread information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 market:
 *                   type: string
 *                   description: Market identifier
 *                   example: "BTC-CLP"
 *                 value:
 *                   type: number
 *                   description: Current spread value
 *                   example: 87194
 *                 recordedAt:
 *                   type: string
 *                   format: date-time
 *                   description: When the spread was recorded
 *                   example: "2025-05-22T12:00:00.000Z"
 *       404:
 *         description: Market not found
 *       500:
 *         description: Server error
 */
router.get('/spread/:market', spreadController.one)

/**
 * @swagger
 * /api/spread/{market}:
 *   post:
 *     summary: Set a spread value for a market, this can be used to set an alert spread
 *     description: Manually set a spread value for a specific market
 *     tags: [Spreads]
 *     parameters:
 *       - in: path
 *         name: market
 *         required: true
 *         schema:
 *           type: string
 *         description: Market identifier (e.g., BTC-CLP)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: number
 *                 description: The spread value to set
 *                 example: 87194
 *     responses:
 *       200:
 *         description: Spread value set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 market:
 *                   type: string
 *                   description: Market identifier
 *                   example: "BTC-CLP"
 *                 value:
 *                   type: number
 *                   description: Set spread value
 *                   example: 87194
 *                 recordedAt:
 *                   type: string
 *                   format: date-time
 *                   description: When the spread was recorded
 *                   example: "2025-05-22T12:00:00.000Z"
 *       400:
 *         description: Invalid spread value
 *       500:
 *         description: Server error
 */
router.post('/spread/:market', spreadController.setSpread)

/**
 * @swagger
 * /api/spreads:
 *   get:
 *     summary: Get all spreads
 *     description: Retrieve spread information for all available markets
 *     tags: [Spreads]
 *     parameters:
 *       - in: query
 *         name: save
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Whether to save the spread values
 *     responses:
 *       200:
 *         description: List of spreads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   market:
 *                     type: string
 *                     description: Market identifier
 *                     example: "BTC-CLP"
 *                   value:
 *                     type: number
 *                     description: Current spread value
 *                     example: 87194
 *                   recordedAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the spread was recorded
 *                     example: "2025-05-22T12:00:00.000Z"
 *       500:
 *         description: Server error
 */
router.get('/spreads', spreadController.all)

/**
 * @swagger
 * /api/spread/{market}/alert:
 *   get:
 *     summary: Get alert spread for a specific market
 *     description: Retrieve the most recent spread information for a given market
 *     tags: [Spreads]
 *     parameters:
 *       - in: path
 *         name: market
 *         required: true
 *         schema:
 *           type: string
 *         description: Market identifier (e.g., btc-clp)
 *     responses:
 *       200:
 *         description: Last spread information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 current:
 *                   type: object
 *                   properties:
 *                     market:
 *                       type: string
 *                       description: Market identifier
 *                       example: "btc-clp"
 *                     value:
 *                       type: number
 *                       description: Current spread value
 *                       example: 1949830.8900000006
 *                     recordedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the current spread was recorded
 *                       example: "2025-05-22T04:04:00.060Z"
 *                 last:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Database ID of the last recorded spread
 *                       example: 2
 *                     market:
 *                       type: string
 *                       description: Market identifier
 *                       example: "btc-clp"
 *                     value:
 *                       type: string
 *                       description: Last recorded spread value
 *                       example: "1949872.90000001"
 *                     recordedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the last spread was recorded
 *                       example: "2025-05-22T04:03:51.776Z"
 *                 diff:
 *                   type: number
 *                   description: Difference between current and last spread value
 *                   example: -42.01000000932254
 *                 percentage:
 *                   type: number
 *                   description: Percentage change between current and last spread value
 *                   example: -0.0021544994040033237
 *                 alert:
 *                   type: string
 *                   description: Alert message indicating the status
 *                   enum: [no-previous-data, same, higher, lower]
 *                   example: "lower"
 *       404:
 *         description: Market not found
 *       500:
 *         description: Server error
 */
router.get('/spread/:market/alert', spreadController.alert)

export default router