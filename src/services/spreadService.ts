// src/services/spreadService.ts
import budaService from '@/services/budaService'
import spreadRepository from '@/repositories/spreadRepository'
import { Spread } from '@/domain/spread'
import { BadRequestError, NotFoundError } from '@/domain/errors'

const _calc = (asks: [string, string][], bids: [string, string][]) => {
  if (asks.length === 0 || bids.length === 0) {
    throw new Error('No orders available in the order book')
  }
  // asks are ordered by price ascending, bids are ordered by price descending according to the API documentation
  const lowestAsk = Number(asks[0][0])
  const highestBid = Number(bids[0][0])
  return lowestAsk - highestBid
}

export const getSpreadForMarket = async (market: string, persist = false) => {
  const orderBookResponse = await budaService.getOrderBook(market);
  const orderBook = orderBookResponse.order_book
  const spread: Spread = {
    market,
    value: _calc(orderBook.asks, orderBook.bids),
    recordedAt: new Date()
  }
  if (persist) await spreadRepository.saveSpread(spread)
  return spread
}

export const getSpreadForAllMarkets = async (persist = false) => {
  const marketsData = await budaService.getMarkets()
  const markets = marketsData.markets
  const results = await Promise.all(
    markets.map(m => getSpreadForMarket(m.id.toLowerCase(), persist))
  )
  return results
}

export const compareWithLast = async (market: string) => {
  const current = await getSpreadForMarket(market, false)
  const last    = await spreadRepository.getLastSpread(market)
  if (!last) return { current, alert: 'no-previous-data' }
  const diff  = current.value - Number(last.value)
  return {
    current,
    last,
    diff,
    percentage: (diff / Number(last.value)) * 100,
    alert: diff === 0 ? 'same' : diff > 0 ? 'higher' : 'lower'
  }
}

export const compareWithSavedSpreads = async (market: string) => {
  const current = await getSpreadForMarket(market)
  const savedSpreads = await spreadRepository.getSpreads(market)
  if (!savedSpreads) return { current, alert: 'no-previous-data' }
  const diffs = savedSpreads.map(s => current.value - Number(s.value))
  const percentages = diffs.map(d => (d / Number(current.value)) * 100)
  const alerts = diffs.map(d => d === 0 ? 'same' : d > 0 ? 'higher' : 'lower')
  return {
    current,
    savedSpreads,
    diffs,
    percentages,
    alerts
  }
}

export const getSpreadAlertById = async (market: string, id: number) => {
  const current = await getSpreadForMarket(market, false)
  const savedSpread = await spreadRepository.getSpreadById(id)
  if (!savedSpread) return { current, alert: 'no-previous-data' }
  const diff = current.value - Number(savedSpread.value)
  const percentage = (diff / Number(savedSpread.value)) * 100
  const alert = diff === 0 ? 'same' : diff > 0 ? 'higher' : 'lower'
  return {
    current,
    savedSpread,
    diff,
    percentage,
    alert
  }
}

export const setSpreadValue = async (market: string, value: number) => {
  if (!value) {
    throw new BadRequestError('Invalid spread value')
  }

  await budaService.getMarket(market)

  const spread: Spread = {
    market,
    value,
    recordedAt: new Date()
  }

  await spreadRepository.saveSpread(spread)
  return spread
}

export const setSpreadStatus = async (id: number, active: boolean) => {
  const spread = await spreadRepository.getSpreadById(id)
  if (!spread) throw new NotFoundError('Spread record not found')
  const updatedSpread = await spreadRepository.updateSpreadStatus(id, active)
  return updatedSpread
}

export const getActiveSpreadsForMarket = async (market: string) => {
  const spreads = await spreadRepository.getActiveSpreadsForMarket(market)
  return spreads
}