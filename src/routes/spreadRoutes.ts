// src/routes/spreadRoutes.ts
import { Router } from 'express'
import * as spreadController from '@/controllers/spreadController'
const router = Router()

router.get('/spread/:market', spreadController.one)
router.get('/spreads', spreadController.all)
router.get('/spread/:market/last', spreadController.last)

export default router