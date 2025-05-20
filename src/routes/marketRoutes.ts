// src/routes/marketRoutes.ts
import { Router } from 'express'
import * as marketController from '@/controllers/marketController'
const router = Router()

router.get('/ticker/:market', marketController.getTicker)

export default router