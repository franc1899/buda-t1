// src/controllers/spreadController.ts
import * as spreadSvc from '@/services/spreadService'
import { Request, Response, NextFunction } from 'express'

export const one = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const save = req.query.save === 'true'
    const data = await spreadSvc.getSpreadForMarket(req.params.market, save)
    res.json(data)
  } catch (e) { next(e) }
}

export const all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const save = req.query.save === 'true'
    const data = await spreadSvc.getSpreadForAllMarkets(save)
    res.json(data)
  } catch (e) { next(e) }
}

export const last = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await spreadSvc.compareWithLast(req.params.market)
    res.json(data)
  } catch (e) { next(e) }
}
