// src/routes/ticketRoutes.ts
import { Router } from 'express'
import * as tickerController from '@/controllers/tickerController'
const router = Router()

/**
 * @swagger
 * /api/ticker/{market}:
 *   get:
 *     summary: Get ticker information for a specific market
 *     description: Retrieve current ticker information including last price, volume, and other market data
 *     tags: [Tickers]
 *     parameters:
 *       - in: path
 *         name: market
 *         required: true
 *         schema:
 *           type: string
 *         description: Market identifier (e.g., BTC-CLP)
 *     responses:
 *       200:
 *         description: Ticker information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticker:
 *                   type: object
 *                   properties:
 *                     market_id:
 *                       type: string
 *                       description: Market identifier (e.g., BTC-CLP)
 *                       example: "BTC-CLP"
 *                     last_price:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Last traded price and currency [price, currency]
 *                       example: ["103912806.0", "CLP"]
 *                     min_ask:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Minimum ask price and currency [price, currency]
 *                       example: ["104000000.0", "CLP"]
 *                     max_bid:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Maximum bid price and currency [price, currency]
 *                       example: ["103912806.0", "CLP"]
 *                     volume:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: 24h trading volume and currency [volume, currency]
 *                       example: ["13.42037685", "BTC"]
 *                     price_variation_24h:
 *                       type: string
 *                       description: Price variation in the last 24 hours
 *                       example: "0.03"
 *                     price_variation_7d:
 *                       type: string
 *                       description: Price variation in the last 7 days
 *                       example: "0.078"
 *       404:
 *         description: Market not found
 *       500:
 *         description: Server error
 */
router.get('/ticker/:market', tickerController.getTicker)

export default router