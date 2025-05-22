// src/routes/marketRoutes.ts
import { Router } from 'express'
import * as marketController from '@/controllers/marketController'
const router = Router()

/**
 * @swagger
 * /api/markets:
 *   get:
 *     summary: Get all markets
 *     description: Retrieve a list of all available markets
 *     tags: [Markets]
 *     responses:
 *       200:
 *         description: A list of markets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 markets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The market ID (e.g., "BTC-CLP")
 *                         example: "BTC-CLP"
 *                       name:
 *                         type: string
 *                         description: The market name (e.g., "btc-clp")
 *                         example: "btc-clp"
 *                       base_currency:
 *                         type: string
 *                         description: The base currency (e.g., "BTC")
 *                         example: "BTC"
 *                       quote_currency:
 *                         type: string
 *                         description: The quote currency (e.g., "CLP")
 *                         example: "CLP"
 *                       minimum_order_amount:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Minimum order amount and currency
 *                         example: ["0.00002", "BTC"]
 *                       disabled:
 *                         type: boolean
 *                         description: Whether the market is disabled
 *                         example: false
 *                       illiquid:
 *                         type: boolean
 *                         description: Whether the market is illiquid
 *                         example: false
 *                       rpo_disabled:
 *                         type: boolean
 *                         nullable: true
 *                         description: Whether RPO is disabled
 *                         example: false
 *                       taker_fee:
 *                         type: number
 *                         description: Taker fee percentage
 *                         example: 0.8
 *                       maker_fee:
 *                         type: number
 *                         description: Maker fee percentage
 *                         example: 0.4
 *                       max_orders_per_minute:
 *                         type: integer
 *                         description: Maximum orders allowed per minute
 *                         example: 100
 *                       maker_discount_percentage:
 *                         type: string
 *                         description: Maker discount percentage
 *                         example: "0.0"
 *                       taker_discount_percentage:
 *                         type: string
 *                         description: Taker discount percentage
 *                         example: "0.0"
 *                       taker_discount_tiers:
 *                         type: object
 *                         description: Taker discount tiers
 *                         example: {}
 *                       maker_discount_tiers:
 *                         type: object
 *                         description: Maker discount tiers
 *                         example: {}
 *       500:
 *         description: Server error
 */

router.get('/markets', marketController.getMarkets)

export default router