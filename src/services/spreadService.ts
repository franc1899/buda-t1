// src/services/spreadService.ts
import budaService from '@/services/budaService'
import { saveSpread, getLastSpread } from '@/repositories/spreadRepository'
import { Spread } from '@/domain/spread'

const _calc = (ask: string, bid: string) => Number(ask) - Number(bid)

export const getSpreadForMarket = async (market: string, persist = false) => {
  const _ticker = await budaService.getTicker(market)
  const spread: Spread = {
    market,
    value: 10, // TODO: calculate spread
    recordedAt: new Date()
  }
  if (persist) await saveSpread(spread)
  return spread
}

export const getSpreadForAllMarkets = async (persist = false) => {
  const markets = await budaService.getMarkets()
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
