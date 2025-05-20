// src/services/spreadService.ts
import budaService from '@/services/budaService'
import { saveSpread, getLastSpread } from '@/repositories/spreadRepository'
import { Spread } from '@/domain/spread'

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
  if (persist) await saveSpread(spread)
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
  const last    = await getLastSpread(market)
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
