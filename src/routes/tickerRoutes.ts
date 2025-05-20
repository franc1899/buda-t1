// src/routes/ticketRoutes.ts
import { Router } from 'express'
import * as tickerController from '@/controllers/tickerController'
const router = Router()

router.get('/ticker/:market', tickerController.getTicker)

export default router