// src/controllers/marketController.ts
import { Request, Response, NextFunction } from 'express'
import budaService from '@/services/budaService'

export const getMarkets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await budaService.getMarkets()
    res.json(result)
  } catch (err) {
    next(err)
  }
}