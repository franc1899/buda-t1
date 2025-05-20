// src/routes/marketRoutes.ts
import { Router } from 'express'
import * as marketController from '@/controllers/marketController'
const router = Router()

router.get('/markets', marketController.getMarkets)

export default router