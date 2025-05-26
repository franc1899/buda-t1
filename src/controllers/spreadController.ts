// src/controllers/spreadController.ts
import logger from '@/config/logger'
import { BadRequestError } from '@/domain/errors'
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

export const alert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await spreadSvc.compareWithLast(req.params.market)
    res.json(data)
  } catch (e) { next(e) }
}

export const alerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await spreadSvc.compareWithSavedSpreads(req.params.market)
    res.json(data)
  } catch (e) { next(e) }
}

export const alertById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const market = req.params.market
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new BadRequestError('Invalid id')
    if (!market) throw new BadRequestError('No market provided')
    const data = await spreadSvc.getSpreadAlertById(market, id)
    res.json(data)
  } catch (e) { next(e) }
}

export const setSpread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { value } = req.body
    const { market } = req.params
    const data = await spreadSvc.setSpreadValue(market, value)
    res.json(data)
  } catch (e) { next(e) }
}

export const setSpreadStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { active } = req.body
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new BadRequestError('Invalid id')
    logger.info(`Setting spread status for id ${id} to ${active}`)
    const data = await spreadSvc.setSpreadStatus(id, active)
    res.json(data)
  } catch (e) { next(e) }
}

export const getActiveSpreadsForMarket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await spreadSvc.getActiveSpreadsForMarket(req.params.market)
    res.json(data)
  } catch (e) { next(e) }
}