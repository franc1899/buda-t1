// src/controllers/tickerController.ts
import { Request, Response, NextFunction } from 'express'
import budaService from '@/services/budaService'

export const getTicker = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { market } = req.params
      const result = await budaService.getTicker(market)
      res.json(result)
    } catch (err) {
      next(err)
    }
}